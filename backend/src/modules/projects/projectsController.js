import prisma from "../../../prisma/prismaClient.js";
import { generateSlug } from "../../../utils/slugGenerator.js";

/**
 * Create a new project
 */
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
        created_by: req.user?.username || null,
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

/**
 * Get all projects (optional filters: status, page, limit)
 */
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
    console.error("❌ Error in getAllProjects:");
    console.error("   Message:", err.message);
    console.error("   Stack:", err.stack);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get project by id
 */
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.projects.findUnique({
      where: { id },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get project by slug
 */
export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await prisma.projects.findUnique({ where: { slug } });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update project
 */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If slug changed, ensure uniqueness
    if (updateData.slug) {
      const existing = await prisma.projects.findUnique({
        where: { slug: updateData.slug },
      });
      if (existing && existing.id !== id) {
        return res.status(400).json({ message: "Project slug already in use" });
      }
    }

    if (typeof updateData.tags === "string")
      updateData.tags = JSON.parse(updateData.tags);
    if (typeof updateData.members === "string")
      updateData.members = JSON.parse(updateData.members);

    const project = await prisma.projects.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete project
 */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.projects.delete({ where: { id } });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

/**
 * Search projects by name or description
 */
export const searchProjects = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q)
      return res.status(400).json({ message: "Search query is required" });

    const projects = await prisma.projects.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      orderBy: { created_at: "desc" },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Add member (email or object) to members JSON array
 */
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { member } = req.body; // expected string/email or object
    if (!member)
      return res.status(400).json({ message: "Missing required fields" });

    const project = await prisma.projects.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const current = project.members || [];
    const newMembers = Array.isArray(current) ? [...current] : [];
    // Avoid duplicates (simple check)
    if (!newMembers.includes(member)) newMembers.push(member);

    const updated = await prisma.projects.update({
      where: { id },
      data: { members: newMembers },
    });
    res.json({ message: "Member added", project: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Remove member from members array
 */
export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { member } = req.body; // email or identifier
    if (!member)
      return res.status(400).json({ message: "Missing required fields" });

    const project = await prisma.projects.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const current = project.members || [];
    const newMembers = Array.isArray(current)
      ? current.filter((m) => m !== member)
      : [];

    const updated = await prisma.projects.update({
      where: { id },
      data: { members: newMembers },
    });
    res.json({ message: "Member removed", project: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
