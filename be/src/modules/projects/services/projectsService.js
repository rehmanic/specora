import prisma from "../../../../config/db/prismaClient.js";
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

const PROJECT_INCLUDES = {
  project_member: true,
  app_user: {
    select: { id: true, display_name: true, username: true, profile_pic_url: true },
  },
};

// ─── Service Functions ────────────────────────────────────

export async function create(data, userId) {
  const { members, ...rest } = data;
  const projectData = { ...rest };

  projectData.slug = generateSlug(projectData.name);
  projectData.start_date = new Date(projectData.start_date);
  projectData.end_date = new Date(projectData.end_date);
  projectData.created_by = projectData.created_by || userId;

  // Ensure creator is in the members list
  const creatorId = projectData.created_by;
  const initialMembers = Array.isArray(members) ? members : [];
  const membersList = initialMembers.includes(creatorId) ? initialMembers : [...initialMembers, creatorId];

  if (membersList.length > 0) {
    projectData.project_member = {
      create: membersList.map((memberId) => ({ member_id: memberId })),
    };
  }

  // Check for duplicate name
  const existing = await prisma.project.findFirst({ where: { name: projectData.name } });
  if (existing) {
    throw new AppError("A project with this name already exists", 400);
  }

  return prisma.project.create({ data: projectData });
}

export async function getAll() {
  const projects = await prisma.project.findMany({ include: PROJECT_INCLUDES });
  return projects.map(formatProject);
}

export async function getByUser(userId, currentUserId) {
  if (userId !== currentUserId) {
    throw new AppError("Access denied. You can only view your own projects.", 403);
  }

  const createdProjects = await prisma.project.findMany({
    where: { created_by: userId },
    include: PROJECT_INCLUDES,
    orderBy: { created_at: "desc" },
  });

  const memberProjectsData = await prisma.project_member.findMany({
    where: { member_id: userId },
    include: { project: { include: PROJECT_INCLUDES } },
  });

  const memberProjects = memberProjectsData
    .map((pm) => pm.project)
    .filter((project) => project.created_by !== userId);

  const allProjects = [...createdProjects, ...memberProjects].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB - dateA;
  });

  return allProjects.map(formatProject);
}

export async function update(projectId, data) {
  const { members, ...rest } = data;
  const projectData = { ...rest };

  projectData.slug = generateSlug(projectData.name);
  projectData.start_date = new Date(projectData.start_date);
  projectData.end_date = new Date(projectData.end_date);
  projectData.updated_at = new Date();

  const updatedProject = await prisma.$transaction(async (tx) => {
    await tx.project.update({ where: { id: projectId }, data: projectData });

    if (members && Array.isArray(members)) {
      await tx.project_member.deleteMany({ where: { project_id: projectId } });
      if (members.length > 0) {
        await tx.project_member.createMany({
          data: members.map((memberId) => ({ project_id: projectId, member_id: memberId })),
        });
      }
    }

    return tx.project.findUnique({
      where: { id: projectId },
      include: { project_member: true },
    });
  });

  return {
    ...updatedProject,
    members: updatedProject.project_member.map((pm) => pm.member_id),
    project_member: undefined,
  };
}

export async function remove(projectId) {
  const existing = await prisma.project.findUnique({ where: { id: projectId } });
  if (!existing) throw new AppError("Project not found", 404);

  await prisma.project.delete({ where: { id: projectId } });
}

export async function getMembers(projectId) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found", 404);

  const members = await prisma.project_member.findMany({
    where: { project_id: projectId },
    include: {
      app_user: {
        select: { id: true, display_name: true, username: true, email: true, profile_pic_url: true },
      },
    },
  });

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

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found", 404);

  const existing = await prisma.project_member.findFirst({
    where: { project_id: projectId, member_id: memberId },
  });
  if (existing) throw new AppError("User is already a project member", 409);

  await prisma.project_member.create({
    data: { project_id: projectId, member_id: memberId },
  });
}

export async function removeMember(projectId, memberId) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new AppError("Project not found", 404);

  if (memberId === project.created_by) {
    throw new AppError("Cannot remove the project creator", 403);
  }

  const deleted = await prisma.project_member.deleteMany({
    where: { project_id: projectId, member_id: memberId },
  });
  if (deleted.count === 0) throw new AppError("Member not found in project", 404);
}

export async function getTags(projectId) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { tags: true },
  });
  if (!project) throw new AppError("Project not found", 404);
  return project.tags;
}

export async function addTag(projectId, tag) {
  if (!tag || typeof tag !== "string" || tag.trim().length < 3 || tag.trim().length > 30) {
    throw new AppError("Tag must be between 3 and 30 characters", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { tags: true },
  });
  if (!project) throw new AppError("Project not found", 404);
  if (project.tags.length >= 10) throw new AppError("Maximum of 10 tags allowed", 400);
  if (project.tags.includes(tag.trim())) throw new AppError("Tag already exists", 409);

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { tags: { push: tag.trim() } },
    select: { tags: true },
  });
  return updated.tags;
}

export async function removeTag(projectId, tag) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { tags: true },
  });
  if (!project) throw new AppError("Project not found", 404);

  const decodedTag = decodeURIComponent(tag);
  if (!project.tags.includes(decodedTag)) {
    throw new AppError("Tag not found on project", 404);
  }

  const updatedTags = project.tags.filter((t) => t !== decodedTag);
  await prisma.project.update({
    where: { id: projectId },
    data: { tags: updatedTags },
  });
  return updatedTags;
}
