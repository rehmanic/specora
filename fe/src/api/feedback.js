import { api } from "./client";
import { FEEDBACKS } from "./endpoints";

// ======================
// Get Project Feedbacks
// ======================
export const getProjectFeedbacks = (projectId) =>
  api.get(FEEDBACKS.BY_PROJECT(projectId), { cache: "no-store" });

export const getFeedback = (feedbackId) =>
  api.get(FEEDBACKS.SINGLE(feedbackId), { cache: "no-store" });

export const createFeedback = (feedbackData) =>
  api.post(FEEDBACKS.CREATE, feedbackData);

export const updateFeedback = (feedbackId, feedbackData) =>
  api.put(FEEDBACKS.SINGLE(feedbackId), feedbackData);

export const deleteFeedback = (feedbackId) =>
  api.delete(FEEDBACKS.SINGLE(feedbackId));

// ======================
// Responses
// ======================

export const submitResponse = (feedbackId, response) =>
  api.post(FEEDBACKS.RESPONSES(feedbackId), { response });

export const getResponses = (feedbackId) =>
  api.get(FEEDBACKS.RESPONSES(feedbackId), { cache: "no-store" });

export const deleteResponse = (responseId) =>
  api.delete(FEEDBACKS.DELETE_RESPONSE(responseId));

export const getUserResponse = (feedbackId) =>
  api.get(FEEDBACKS.MY_RESPONSE(feedbackId), { cache: "no-store" });
