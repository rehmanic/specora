import * as projectsRepo from "../repositories/projectsRepository.js";
import { generateSlug } from "../../../utils/slugGenerator.js";
import AppError from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────

const formatProject = (p) => ({
  ...p,
  members: p.project_member.map((pm) => pm.member_id),
  creator: p.app_user,
  project_member: undefined,
  app_user: undefined,
});

// ─── Service Functions ────────────────────────────────────

export async function create(data, userId) {
  const { members, ...rest } = data;
  const projectData = { ...rest };

  projectData.slug = generateSlug(projectData.name);
  projectData.start_date = new Date(projectData.start_date);
  projectData.end_date = new Date(projectData.end_date);
  projectData.created_by = projectData.created_by || userId;

  const existing = await projectsRepo.findProjectByName(projectData.name);
  if (existing) {
    throw new AppError("A project with this name already exists", 400);
  }

  return await projectsRepo.createProjectTransaction(projectData, members);
}

export async function getAll() {
  const projects = await projectsRepo.findAllProjects();
  return projects.map(formatProject);
}

export async function getByUser(userId, currentUserId) {
  if (userId !== currentUserId) {
    throw new AppError("Access denied. You can only view your own projects.", 403);
  }

  const allProjects = await projectsRepo.findProjectsByUser(userId);

  return allProjects.map(formatProject);
}

export async function update(projectId, data) {
  const { members, ...rest } = data;
  const projectData = { ...rest };

  if (projectData.name) {
    projectData.slug = generateSlug(projectData.name);
  }
  if (projectData.start_date) projectData.start_date = new Date(projectData.start_date);
  if (projectData.end_date) projectData.end_date = new Date(projectData.end_date);
  projectData.updated_at = new Date();

  const updatedProject = await projectsRepo.updateProjectTransaction(projectId, projectData, members);

  return {
    ...updatedProject,
    members: updatedProject.project_member.map((pm) => pm.member_id),
    project_member: undefined,
  };
}

export async function remove(projectId) {
  const existing = await projectsRepo.findProjectById(projectId);
  if (!existing) throw new AppError("Project not found", 404);

  await projectsRepo.deleteProjectRecord(projectId);
}

export async function getMembers(projectId) {
  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const members = await projectsRepo.findProjectMembers(projectId);

  return members.map((m) => ({
    id: m.app_user.id,
    name: m.app_user.display_name || m.app_user.username,
    email: m.app_user.email,
    profile_pic_url: m.app_user.profile_pic_url,
    isOwner: m.app_user.id === project.created_by,
  }));
}

export async function addMember(projectId, memberId) {
  if (!memberId) throw new AppError("memberId is required", 400);

  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const existing = await projectsRepo.findProjectMember(projectId, memberId);
  if (existing) throw new AppError("User is already a project member", 409);

  await projectsRepo.addProjectMember(projectId, memberId);
}

export async function removeMember(projectId, memberId) {
  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  if (memberId === project.created_by) {
    throw new AppError("Cannot remove the project creator", 403);
  }

  const deleted = await projectsRepo.deleteProjectMember(projectId, memberId);
  if (deleted.count === 0) throw new AppError("Member not found in project", 404);
}

export async function getTags(projectId) {
  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);
  return project.tags;
}

export async function addTag(projectId, tag) {
  if (!tag || typeof tag !== "string" || tag.trim().length < 3 || tag.trim().length > 30) {
    throw new AppError("Tag must be between 3 and 30 characters", 400);
  }

  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);
  if (project.tags.length >= 10) throw new AppError("Maximum of 10 tags allowed", 400);
  if (project.tags.includes(tag.trim())) throw new AppError("Tag already exists", 409);

  const updatedTags = await projectsRepo.addTag(projectId, tag.trim());
  return updatedTags;
}

export async function removeTag(projectId, tag) {
  const project = await projectsRepo.findProjectById(projectId);
  if (!project) throw new AppError("Project not found", 404);

  const decodedTag = decodeURIComponent(tag);
  if (!project.tags.includes(decodedTag)) {
    throw new AppError("Tag not found on project", 404);
  }

  const newTags = project.tags.filter((t) => t !== decodedTag);
  const updatedTags = await projectsRepo.removeTagTransaction(projectId, newTags);
  return updatedTags;
}
