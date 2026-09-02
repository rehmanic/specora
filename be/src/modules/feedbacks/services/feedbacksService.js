import * as feedbacksRepo from "../repositories/feedbacksRepository.js";
import AppError from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────

export async function resolveProject(projectId) {
  const project = await feedbacksRepo.findProjectByIdOrSlug(projectId);

  if (!project) throw new AppError("Project not found", 404);
  return project;
}

export async function checkMembership(projectId, userId, createdBy) {
  const projectMember = await feedbacksRepo.findProjectMember(projectId, userId);

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
    return await feedbacksRepo.createFeedbackRecord({
        title,
        description,
        form_structure: formStructure,
        status: status || 'created',
        project_id: project.id,
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

  return await feedbacksRepo.findFeedbacksByProject(project.id);
}

export async function getFeedback(feedbackId, userId) {
  const feedback = await feedbacksRepo.findFeedbackById(feedbackId);

  if (!feedback) throw new AppError("Feedback not found", 404);
  await checkMembership(feedback.project_id, userId, feedback.project.created_by);

  return feedback;
}

export async function updateFeedback(feedbackId, data) {
  const { formStructure, ...otherData } = data;
  return await feedbacksRepo.updateFeedbackRecord(feedbackId, {
      ...otherData,
      form_structure: formStructure,
      updated_at: new Date()
  });
}

export async function deleteFeedback(feedbackId) {
  await feedbacksRepo.deleteFeedbackRecord(feedbackId);
}

// ─── Feedback Responses ───────────────────────────────────

export async function submitResponse(feedbackId, userId, responseData) {
  const feedback = await feedbacksRepo.findFeedbackById(feedbackId);

  if (!feedback) throw new AppError("Feedback not found", 404);
  await checkMembership(feedback.project_id, userId, feedback.project.created_by);

  const existingResponse = await feedbacksRepo.findFeedbackResponse(feedbackId, userId);

  if (existingResponse) {
    return await feedbacksRepo.updateFeedbackResponse(existingResponse.id, responseData);
  } else {
    return await feedbacksRepo.createFeedbackResponse({
        feedback_id: feedbackId,
        response: responseData,
        respondent_id: userId
    });
  }
}

export async function getUserResponse(feedbackId, userId) {
  return await feedbacksRepo.findFeedbackResponse(feedbackId, userId);
}

export async function getResponses(feedbackId) {
  const feedback = await feedbacksRepo.findFeedbackById(feedbackId);

  if (!feedback) throw new AppError("Feedback not found", 404);

  return await feedbacksRepo.findResponsesByFeedback(feedbackId);
}

export async function deleteResponse(responseId, userId, userRole) {
  const response = await feedbacksRepo.findResponseById(responseId);

  if (!response) throw new AppError("Response not found", 404);

  const isManager = ["manager", "requirements_engineer"].includes(userRole);
  const isOwner = response.respondent_id === userId;

  if (!isManager && !isOwner) {
    throw new AppError("Access denied", 403);
  }

  await feedbacksRepo.deleteResponseRecord(responseId);
}
