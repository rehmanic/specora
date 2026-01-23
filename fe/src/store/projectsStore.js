// src/store/projectsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserProjects } from "@/api/projects";
import useAuthStore from "./authStore";

const useProjectsStore = create(
  persist(
    (set) => ({
      selectedProject: null,
      projects: [],
      isLoading: false,
      error: null,

      // ✅ Fetch Projects from API
      fetchProjects: async () => {
        set({ isLoading: true });
        try {
          const { user } = useAuthStore.getState();
          if (!user?.id) throw new Error("User not authenticated");

          const data = await getUserProjects(user.id);
          const projectsList = Array.isArray(data) ? data : (data.projects || []);

          set({ projects: projectsList, isLoading: false });
        } catch (error) {
          console.error("Fetch projects error:", error);
          set({ error: error.message || "Failed to fetch projects", isLoading: false });
        }
      },

      // ✅ Set selected project only
      setSelectedProject: (project) =>
        set({ selectedProject: project, error: null }),

      // ✅ Clear selected project
      clearSelectedProject: () => set({ selectedProject: null, error: null }),

      // ✅ Set error
      setError: (error) => set({ error }),

      // ✅ Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "projects-storage", // localStorage key
      partialize: (state) => ({
        selectedProject: state.selectedProject,
        // Don't persist error state
      }),
    }
  )
);

export default useProjectsStore;
