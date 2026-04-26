import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false, // ⭐ IMPORTANT

      login: (user, accessToken) => set({ user, accessToken }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),

      // ⭐ THIS FIXES YOUR BUG
      onRehydrateStorage: () => (state) => {
        state.hasHydrated = true;
      },
    }
  )
);

export default useAuthStore;