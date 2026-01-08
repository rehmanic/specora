// src/store/projectsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectsStore = create(
  persist(
    (set) => ({
      selectedProject: null,
      error: null,

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
