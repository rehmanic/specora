import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null, // ✅ check before using
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }

      set({ user: data.user, token: data.token, loading: false });
      return data.user;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
