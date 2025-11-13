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
          set({ loading: false, error: err.message });
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
          set({ loading: false, error: err.message });
          throw err;
        }
      },

      logout: async () => {
        await logoutRequest();
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
