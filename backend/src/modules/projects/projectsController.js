import prisma from "../../../config/db/prismaClient.js";
import { generateSlug } from "../../../utils/slugGenerator.js";

// ======================
// New Project
// ======================
export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      cover_image_url,
      icon_url,
      status,
      start_date,
      end_date,
      tags,
      members,
      created_by: userId,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    // ✅ Generate and ensure unique slug
    let slug = generateSlug(name);
    const existing = await prisma.projects.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    // ✅ Parse tags & members if sent as strings
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
    const parsedMembers =
      typeof members === "string" ? JSON.parse(members) : members;

    // ✅ Validate members (ensure usernames exist)
    const validUsers = await prisma.users.findMany({
      where: { username: { in: parsedMembers } },
      select: { username: true },
    });

    const validMemberUsernames = validUsers.map((u) => u.username);

    // ✅ Create project
    const project = await prisma.projects.create({
      data: {
        name,
        slug,
        description,
        cover_image_url,
        icon_url,
        status,
        start_date: start_date || null,
        end_date: end_date || null,
        tags: parsedTags || [],
        members: validMemberUsernames,
        created_by: userId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        cover_image_url: true,
        icon_url: true,
        status: true,
        tags: true,
        members: true,
        created_at: true,
        updated_at: true,
        created_by: true,
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ======================
// All System Projects
// ======================
export const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;

    const take = Math.min(parseInt(limit, 10) || 50, 200);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * take;

    const projects = await prisma.projects.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        cover_image_url: true,
        icon_url: true,
        status: true,
        tags: true,
        members: true,
        created_at: true,
        updated_at: true,
        created_by: true,
      },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ======================
// Update Project
// ======================
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      name,
      slug,
      description,
      cover_image_url,
      icon_url,
      status,
      start_date,
      end_date,
      tags,
      members,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    // Check if project exists
    const existingProject = await prisma.projects.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update the project
    const updatedProject = await prisma.projects.update({
      where: { id: projectId },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(cover_image_url && { cover_image_url }),
        ...(icon_url && { icon_url }),
        ...(status && { status }),
        ...(start_date && { start_date: new Date(start_date) }),
        ...(end_date && { end_date: new Date(end_date) }),
        ...(Array.isArray(tags) && { tags }),
        ...(Array.isArray(members) && { members }),
        updated_at: new Date(),
      },
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// Delete Project
// ======================
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const existingProject = await prisma.projects.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.projects.delete({
      where: { id: projectId },
    });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===========================
// Get Single User's Projects
// ===========================
export const getSingleUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await prisma.projects.findMany({
      where: { created_by: userId },
      orderBy: { created_at: "desc" },
    });

    if (!projects.length) {
      return res.status(200).json({ projects: [] });
    }

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
