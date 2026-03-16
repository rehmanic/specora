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

    // Ensure creator is in the members list
    const creatorId = projectData.created_by;
    const initialMembers = Array.isArray(members) ? members : [];
    const membersList = initialMembers.includes(creatorId) ? initialMembers : [...initialMembers, creatorId];

    // Handle members relation
    if (membersList.length > 0) {
      projectData.project_member = {
        create: membersList.map((memberId) => ({
          member_id: memberId,
        })),
      };
    }

    // Check if project with same name already exists
    const existingProject = await prisma.project.findFirst({
      where: { name: projectData.name }
    });

    if (existingProject) {
      return res.status(400).json({ message: "A project with this name already exists" });
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
    const projects = await prisma.project.findMany({
      include: {
        project_member: true,
        app_user: {
          select: {
            id: true,
            display_name: true,
            username: true,
            profile_pic_url: true,
          },
        },
      },
    });

    const formattedProjects = projects.map(p => ({
      ...p,
      members: p.project_member.map(pm => pm.member_id),
      creator: p.app_user,
      project_member: undefined,
      app_user: undefined
    }));

    res.status(200).json({
      message: "Fetching all projects successful",
      count: formattedProjects.length,
      projects: formattedProjects,
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
      include: {
        project_member: true, // Include members
        app_user: {
          select: {
            id: true,
            display_name: true,
            username: true,
            profile_pic_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Step 2: Get projects where user is a member
    const memberProjectsData = await prisma.project_member.findMany({
      where: {
        member_id: userId,
      },
      include: {
        project: {
          include: {
            project_member: true, // Include members for these projects too
            app_user: {
              select: {
                id: true,
                display_name: true,
                username: true,
                profile_pic_url: true,
              },
            },
          },
        },
      },
    });

    const memberProjects = memberProjectsData
      .map((pm) => pm.project)
      .filter((project) => project.created_by !== userId);

    // Step 3: Combine and format
    const allProjects = [...createdProjects, ...memberProjects].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB - dateA;
    });

    // Format projects to include flat 'members' array of IDs and alias app_user -> creator
    const formattedProjects = allProjects.map(p => ({
      ...p,
      members: p.project_member.map(pm => pm.member_id),
      creator: p.app_user,
      project_member: undefined, // Setup cleaner response
      app_user: undefined
    }));

    if (!formattedProjects || formattedProjects.length === 0) {
      return res.status(200).json({
        message: "No projects found for this user",
        count: 0,
        projects: [],
      });
    }

    res.status(200).json({
      message: "Fetching user projects successful",
      count: formattedProjects.length,
      projects: formattedProjects,
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

    const { members, ...dataToUpdate } = projectData;
    console.log("Update Payload:", { members, dataToUpdateKeys: Object.keys(dataToUpdate) });

    // Transaction to update project and members
    const updatedProject = await prisma.$transaction(async (prisma) => {
      // 1. Update Project Details
      const project = await prisma.project.update({
        where: { id: projectId },
        data: dataToUpdate,
        // We can't include here if we are about to delete/create members (race condition in result?)
        // Actually, update happens first. Then we delete/create. 
        // So the returned 'project' will have OLD members if we include here.
        // We need to fetch it again or manually construct result.
      });

      // 2. Sync Members if provided
      if (members && Array.isArray(members)) {
        // Remove existing members
        await prisma.project_member.deleteMany({
          where: { project_id: projectId },
        });

        // Add new members
        if (members.length > 0) {
          await prisma.project_member.createMany({
            data: members.map((memberId) => ({
              project_id: projectId,
              member_id: memberId,
            })),
          });
        }
      }

      // 3. Return updated project with members
      // Since we modified members table, we should re-fetch to be safe and accurate
      return await prisma.project.findUnique({
        where: { id: projectId },
        include: { project_member: true }
      });
    });

    // Format response
    const formattedProject = {
      ...updatedProject,
      members: updatedProject.project_member.map(pm => pm.member_id),
      project_member: undefined
    };

    return res.status(200).json({
      message: "Project updated successfully",
      project: formattedProject,
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
