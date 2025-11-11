// src/store/projectsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserProjects } from "@/api/projects";
import useAuthStore from "@/store/authStore";

const useProjectsStore = create(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      error: null,
      selectedProject: null,

      // ✅ Fetch all projects for current user
      fetchProjects: async () => {
        const { user, token } = useAuthStore.getState();
        if (!user?.id || !token) return;

        set({ loading: true, error: null });
        try {
          const data = await getUserProjects(user.id);
          set({ projects: data.projects || [], loading: false });
        } catch (err) {
          set({ loading: false, error: err.message });
          console.error("Error fetching projects:", err);
        }
      },

      // ✅ Set currently selected project
      setSelectedProject: (project) => {
        set({ selectedProject: project });
      },

      // ✅ Clear selected project if needed
      clearSelectedProject: () => {
        set({ selectedProject: null });
      },
    }),
    {
      name: "projects-storage", // localStorage key
      partialize: (state) => ({
        selectedProject: state.selectedProject,
      }),
    }
  )
);

export default useProjectsStore;
