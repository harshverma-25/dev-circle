import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      /**
       * Called after a successful login or register response.
       * Stores the user object and the access token.
       */
      login: (user, accessToken) => set({ user, accessToken }),

      /**
       * Updates only the access token — used by the refresh flow.
       */
      setAccessToken: (accessToken) => set({ accessToken }),

      /**
       * Clears all auth state. The Axios interceptor also calls this
       * path through localStorage on 401 + refresh failure.
       */
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
      // Only persist user & accessToken — skip functions
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

export default useAuthStore;
