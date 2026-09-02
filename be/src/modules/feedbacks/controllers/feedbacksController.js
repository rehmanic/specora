import asyncHandler from "../../../utils/asyncHandler.js";
import * as feedbacksService from "../services/feedbacksService.js";

// ─── Feedbacks ────────────────────────────────────────────

export const createFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbacksService.createFeedback(req.body.projectId, req.user.userId, req.body);
  res.status(201).json({ message: "Feedback form created successfully", feedback });
});

export const getProjectFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await feedbacksService.getProjectFeedbacks(req.params.projectId, req.user.userId);
  res.status(200).json({ message: "Feedbacks fetched successfully", feedbacks });
});

export const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbacksService.getFeedback(req.params.feedbackId, req.user.userId);
  res.status(200).json({ message: "Feedback fetched successfully", feedback });
});

export const updateFeedback = asyncHandler(async (req, res) => {
  const feedback = await feedbacksService.updateFeedback(req.params.feedbackId, req.body);
  res.status(200).json({ message: "Feedback updated successfully", feedback });
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  await feedbacksService.deleteFeedback(req.params.feedbackId);
  res.status(200).json({ message: "Feedback deleted successfully" });
});

// ─── Feedback Responses ───────────────────────────────────

export const submitResponse = asyncHandler(async (req, res) => {
  const response = await feedbacksService.submitResponse(req.params.feedbackId, req.user.userId, req.body.response);
  res.status(201).json({ message: "Response submitted successfully", response });
});

export const getUserResponse = asyncHandler(async (req, res) => {
  const response = await feedbacksService.getUserResponse(req.params.feedbackId, req.user.userId);
  res.status(200).json({ message: "User response fetched", response });
});

export const getResponses = asyncHandler(async (req, res) => {
  const responses = await feedbacksService.getResponses(req.params.feedbackId);
  res.status(200).json({ message: "Responses fetched successfully", responses });
});

export const deleteResponse = asyncHandler(async (req, res) => {
  await feedbacksService.deleteResponse(req.params.responseId, req.user.userId, req.user.role);
  res.status(200).json({ message: "Response deleted successfully" });
});
