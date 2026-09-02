import asyncHandler from "../../../utils/asyncHandler.js";
import * as projectsService from "../services/projectsService.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectsService.create(req.body, req.user.userId);
  res.status(201).json({ message: "Project created successfully", project });
});

export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectsService.getAll();
  res.status(200).json({ message: "Fetching all projects successful", count: projects.length, projects });
});

export const getSingleUserProjects = asyncHandler(async (req, res) => {
  const projects = await projectsService.getByUser(req.params.userId, req.user.userId);

  if (!projects || projects.length === 0) {
    return res.status(200).json({ message: "No projects found for this user", count: 0, projects: [] });
  }

  res.status(200).json({ message: "Fetching user projects successful", count: projects.length, projects });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectsService.update(req.params.projectId, req.body);
  res.status(200).json({ message: "Project updated successfully", project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  await projectsService.remove(req.params.projectId);
  res.status(200).json({ message: "Project deleted successfully" });
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const members = await projectsService.getMembers(req.params.projectId);
  res.status(200).json({ message: "Project members fetched", members });
});

export const addProjectMember = asyncHandler(async (req, res) => {
  await projectsService.addMember(req.params.projectId, req.body.memberId);
  res.status(201).json({ message: "Member added successfully" });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  await projectsService.removeMember(req.params.projectId, req.params.memberId);
  res.status(200).json({ message: "Member removed successfully" });
});

export const getProjectTags = asyncHandler(async (req, res) => {
  const tags = await projectsService.getTags(req.params.projectId);
  res.status(200).json({ message: "Project tags fetched", tags });
});

export const addProjectTag = asyncHandler(async (req, res) => {
  const tags = await projectsService.addTag(req.params.projectId, req.body.tag);
  res.status(201).json({ message: "Tag added successfully", tags });
});

export const removeProjectTag = asyncHandler(async (req, res) => {
  const tags = await projectsService.removeTag(req.params.projectId, req.params.tag);
  res.status(200).json({ message: "Tag removed successfully", tags });
});
