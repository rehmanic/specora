import express from "express";
import {
    createFeedback,
    getFeedback,
    getProjectFeedbacks,
    submitResponse,
    getResponses,
    updateFeedback,
    deleteFeedback,
    deleteResponse,
    getUserResponse
} from "../controllers/feedbacksController.js";
import { verifyToken } from "../../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../../middlewares/common/requirePermissions.js";
import { validate } from "../../../middlewares/validate.js";
import {
    createFeedbackValidator,
    updateFeedbackValidator,
    submitResponseValidator
} from "../validators.js";

const router = express.Router();

// Common routes (token-protected)
router.get("/project/:projectId", verifyToken, requirePermissions("view_feedback_forms"), getProjectFeedbacks);
router.get("/:feedbackId", verifyToken, requirePermissions("view_feedback_forms"), getFeedback);

// Client response routes
router.post("/:feedbackId/responses", verifyToken, requirePermissions("submit_feedback_response"), submitResponseValidator, validate, submitResponse);
router.get("/:feedbackId/my-response", verifyToken, requirePermissions("view_own_feedback_response"), getUserResponse);
router.delete("/responses/:responseId", verifyToken, requirePermissions("delete_feedback_form"), deleteResponse);

// Manager / Req Engineer routes
router.post("/", verifyToken, requirePermissions("create_feedback_form"), createFeedbackValidator, validate, createFeedback);
router.put("/:feedbackId", verifyToken, requirePermissions("update_feedback_form"), updateFeedbackValidator, validate, updateFeedback);
router.delete("/:feedbackId", verifyToken, requirePermissions("delete_feedback_form"), deleteFeedback);
router.get("/:feedbackId/responses", verifyToken, requirePermissions("view_feedback_form_responses"), getResponses);

export default router;
