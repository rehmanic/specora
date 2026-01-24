import prisma from "../../../config/db/prismaClient.js";
import { generateSlug } from "../../utils/slugGenerator.js";

// ======================
// NEW PROJECT
// ======================
export const createProject = async (req, res) => {
  try {
    const { members, ...rest } = req.body;
    const projectData = { ...rest };

    let slug = generateSlug(projectData.name);
    let startDate = new Date(projectData.start_date);
    let endDate = new Date(projectData.end_date);

    projectData.slug = slug;
    projectData.start_date = startDate;
    projectData.end_date = endDate;
    projectData.created_by = projectData.created_by || req.user.userId;

    // Handle members relation
    if (members && Array.isArray(members) && members.length > 0) {
      projectData.project_member = {
        create: members.map((memberId) => ({
          member_id: memberId,
        })),
      };
    }

    const project = await prisma.project.create({
      data: projectData,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// GET ALL PROJECTS
// ======================
export const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();

    res.status(200).json({
      message: "Fetching all projects successful",
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===========================
// GET SINGLE USER PROJECTS
// ===========================
export const getSingleUserProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId; // From JWT token

    // Users can only fetch their own projects
    if (userId !== currentUserId) {
      return res.status(403).json({ message: "Access denied. You can only view your own projects." });
    }

    // Get projects where user is creator or member
    // Strategy: Get projects where user is creator, then get all other projects
    // and filter for those where user is in members array

    // Step 1: Get projects where user is the creator
    const createdProjects = await prisma.project.findMany({
      where: {
        created_by: userId,
      },
      orderBy: { created_at: "desc" },
    });

    // Step 2: Get projects where user is a member
    const memberProjectsData = await prisma.project_member.findMany({
      where: {
        member_id: userId,
      },
      include: {
        project: true,
      },
    });

    const memberProjects = memberProjectsData
      .map((pm) => pm.project)
      .filter((project) => project.created_by !== userId); // Exclude projects already in createdProjects

    // Step 3: Combine both lists and sort by created_at descending
    const userProjects = [...createdProjects, ...memberProjects].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB - dateA;
    });

    if (!userProjects || userProjects.length === 0) {
      return res.status(200).json({
        message: "No projects found for this user",
        count: 0,
        projects: [],
      });
    }

    res.status(200).json({
      message: "Fetching user projects successful",
      count: userProjects.length,
      projects: userProjects,
    });
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// UPDATE PROJECT
// ======================
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const projectData = req.body;

    let slug = generateSlug(projectData.name);
    let startDate = new Date(projectData.start_date);
    let endDate = new Date(projectData.end_date);

    projectData.slug = slug;
    projectData.start_date = startDate;
    projectData.end_date = endDate;
    projectData.updated_at = new Date();

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: projectData,
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
// DELETE PROJECT
// ======================
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
