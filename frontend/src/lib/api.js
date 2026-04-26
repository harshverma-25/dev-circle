import axios from "axios";

// Create the central Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send cookies (refresh token) automatically
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach the access token from Zustand store (or localStorage as fallback)
// We import dynamically to avoid circular dependency issues with the store.
api.interceptors.request.use(
  (config) => {
    // Read raw zustand persisted state from localStorage
    let token = null;
    try {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        const parsed = JSON.parse(raw);
        token = parsed?.state?.accessToken ?? null;
      }
    } catch {
      // localStorage may not be available in SSR; silently skip
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// On 401 → attempt one silent token refresh via GET /api/auth/refresh
// then retry the original request. On second failure → logout.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Exclude the refresh endpoint itself to prevent infinite loops
      if (originalRequest.url === "/api/auth/refresh") {
          return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests that come in while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is stored in httpOnly cookie — backend reads it automatically
        const { data } = await api.get("/api/auth/refresh");
        const newAccessToken = data.accessToken;

        // Use Zustand store dynamically instead of manual localstorage writes
        const useAuthStore = (await import("../store/useAuthStore")).default;
        useAuthStore.getState().setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear Zustand state
        const useAuthStore = (await import("../store/useAuthStore")).default;
        useAuthStore.getState().logout();

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
