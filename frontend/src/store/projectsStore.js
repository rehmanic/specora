import { create } from "zustand";
import { getAllProjects } from "@/api/projects";

const useProjectsStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (token) => {
    set({ loading: true, error: null });
    try {
      const data = await getAllProjects(token);
      set({ projects: data.projects || data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      console.error("Error fetching projects:", err);
    }
  },
}));

export default useProjectsStore;
