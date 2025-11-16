import prisma from "../../../config/db/prismaClient.js";
import { generateSlug } from "../../utils/slugGenerator.js";

// ======================
// NEW PROJECT
// ======================
export const createProject = async (req, res) => {
  try {
    const projectData = req.body;

    let slug = generateSlug(projectData.name);
    let startDate = new Date(projectData.start_date);
    let endDate = new Date(projectData.end_date);

    projectData.slug = slug;
    projectData.start_date = startDate;
    projectData.end_date = endDate;
    projectData.created_by = projectData.created_by || req.user.userId;

    const project = await prisma.projects.create({
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
    const projects = await prisma.projects.findMany();

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

    if (!projects || projects.length === 0) {
      return res.status(200).json({ message: "No projects for this user" });
    }

    res.status(200).json({
      message: "Fetching user projects successful",
      count: projects.length,
      projects,
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

    const updatedProject = await prisma.projects.update({
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
