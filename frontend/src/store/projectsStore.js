// src/store/projectsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProjectsStore = create(
  persist(
    (set) => ({
      selectedProject: null,

      // ✅ Set selected project only
      setSelectedProject: (project) => set({ selectedProject: project }),

      // ✅ Clear selected project
      clearSelectedProject: () => set({ selectedProject: null }),
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
