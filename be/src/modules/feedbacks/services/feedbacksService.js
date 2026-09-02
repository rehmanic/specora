import prisma from "../../../../config/db/prismaClient.js";
import AppError from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────

export async function resolveProject(projectId) {
  const project = await prisma.project.findFirst({
    where: {
      OR: [
        { id: projectId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? projectId : undefined },
        { slug: projectId }
      ]
    }
  });

  if (!project) throw new AppError("Project not found", 404);
  return project;
}

export async function checkMembership(projectId, userId, createdBy) {
  const projectMember = await prisma.project_member.findFirst({
    where: {
      project_id: projectId,
      member_id: userId
    }
  });

  if (!projectMember && createdBy !== userId) {
    throw new AppError("Access denied. You are not a member of this project.", 403);
  }
}

// ─── Feedbacks ────────────────────────────────────────────

export async function createFeedback(projectId, userId, data) {
  const { title, description, formStructure, status } = data;
  const project = await resolveProject(projectId);
  await checkMembership(project.id, userId, project.created_by);

  try {
    return await prisma.feedback.create({
      data: {
        title,
        description,
        form_structure: formStructure,
        status: status || 'created',
        project_id: project.id,
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError("A feedback with this title already exists.", 409);
    }
    throw error;
  }
}

export async function getProjectFeedbacks(projectId, userId) {
  const project = await resolveProject(projectId);
  await checkMembership(project.id, userId, project.created_by);

  return await prisma.feedback.findMany({
    where: { project_id: project.id },
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { feedback_response: true }
      }
    }
  });
}

export async function getFeedback(feedbackId, userId) {
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
    include: { project: true }
  });

  if (!feedback) throw new AppError("Feedback not found", 404);
  await checkMembership(feedback.project_id, userId, feedback.project.created_by);

  return feedback;
}

export async function updateFeedback(feedbackId, data) {
  const { formStructure, ...otherData } = data;
  return await prisma.feedback.update({
    where: { id: feedbackId },
    data: {
      ...otherData,
      form_structure: formStructure,
      updated_at: new Date()
    }
  });
}

export async function deleteFeedback(feedbackId) {
  await prisma.feedback.delete({ where: { id: feedbackId } });
}

// ─── Feedback Responses ───────────────────────────────────

export async function submitResponse(feedbackId, userId, responseData) {
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
    include: { project: true }
  });

  if (!feedback) throw new AppError("Feedback not found", 404);
  await checkMembership(feedback.project_id, userId, feedback.project.created_by);

  const existingResponse = await prisma.feedback_response.findFirst({
    where: {
      feedback_id: feedbackId,
      respondent_id: userId
    }
  });

  if (existingResponse) {
    return await prisma.feedback_response.update({
      where: { id: existingResponse.id },
      data: {
        response: responseData,
        updated_at: new Date()
      }
    });
  } else {
    return await prisma.feedback_response.create({
      data: {
        feedback_id: feedbackId,
        response: responseData,
        respondent_id: userId
      }
    });
  }
}

export async function getUserResponse(feedbackId, userId) {
  return await prisma.feedback_response.findFirst({
    where: {
      feedback_id: feedbackId,
      respondent_id: userId
    }
  });
}

export async function getResponses(feedbackId) {
  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId }
  });

  if (!feedback) throw new AppError("Feedback not found", 404);

  return await prisma.feedback_response.findMany({
    where: { feedback_id: feedbackId },
    orderBy: { created_at: 'desc' },
    include: {
      app_user: {
        select: {
          id: true,
          username: true,
          display_name: true,
          role: { select: { name: true } }
        }
      }
    }
  });
}

export async function deleteResponse(responseId, userId, userRole) {
  const response = await prisma.feedback_response.findUnique({
    where: { id: responseId }
  });

  if (!response) throw new AppError("Response not found", 404);

  const isManager = ["manager", "requirements_engineer"].includes(userRole);
  const isOwner = response.respondent_id === userId;

  if (!isManager && !isOwner) {
    throw new AppError("Access denied", 403);
  }

  await prisma.feedback_response.delete({
    where: { id: responseId }
  });
}
