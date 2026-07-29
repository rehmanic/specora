import { api } from "./client";
import { PROJECTS } from "./endpoints";

// ======================
// Get All Projects
// ======================
export const getAllProjects = (/* token — unused, client reads from store */) =>
  api.get(PROJECTS.ALL, { cache: "no-store" });

// ======================
// Get User Projects
// ======================
export const getUserProjects = (userId) =>
  api.get(PROJECTS.BY_USER(userId));

// ======================
// Create Project
// ======================
export const createProject = (projectData) =>
  api.post(PROJECTS.CREATE, projectData);

// ======================
// Update Project
// ======================
export const updateProject = (projectId, updateData) =>
  api.put(PROJECTS.SINGLE(projectId), updateData);

// ======================
// Delete Project
// ======================
export const deleteProject = (projectId) =>
  api.delete(PROJECTS.SINGLE(projectId));

// ======================
// Member Management
// ======================

/** Fetch all members for a project */
export const getProjectMembers = (projectId) =>
  api.get(PROJECTS.MEMBERS(projectId));

/** Add a member to a project */
export const addProjectMember = (projectId, memberId) =>
  api.post(PROJECTS.MEMBERS(projectId), { memberId });

/** Remove a member from a project */
export const removeProjectMember = (projectId, memberId) =>
  api.delete(PROJECTS.MEMBER(projectId, memberId));

// ======================
// Tag Management
// ======================

/** Fetch all tags for a project */
export const getProjectTags = (projectId) =>
  api.get(PROJECTS.TAGS(projectId));

/** Add a tag to a project */
export const addProjectTag = (projectId, tag) =>
  api.post(PROJECTS.TAGS(projectId), { tag });

/** Remove a tag from a project */
export const removeProjectTag = (projectId, tag) =>
  api.delete(PROJECTS.TAG(projectId, tag));
