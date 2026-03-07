import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest, signupRequest, logoutRequest } from "@/api/auth";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      updateUser: (newUserData) => set({ user: newUserData }),

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await loginRequest(credentials);
          set({
            user: data.user,
            token: data.token,
            loading: false,
          });
          return data.user;
        } catch (err) {
          const errorMessage =
            err?.message || "An unexpected error occurred. Please try again.";
          set({ loading: false, error: errorMessage });
          throw err;
        }
      },

      signup: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await signupRequest(credentials);
          set({
            user: data.user,
            token: data.token,
            loading: false,
          });
          return data.user;
        } catch (err) {
          const errorMessage =
            err?.message || "An unexpected error occurred. Please try again.";
          set({ loading: false, error: errorMessage });
          throw err;
        }
      },

      logout: async () => {
        try {
          await logoutRequest();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          // Clear auth store state
          set({ user: null, token: null, error: null });
          // Clear auth-storage from localStorage
          localStorage.removeItem("auth-storage");
          // Clear projects-storage from localStorage
          localStorage.removeItem("projects-storage");
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
