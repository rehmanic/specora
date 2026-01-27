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
} from "./feedbacksController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requireRoles } from "../../middlewares/common/roleCheck.js";

const router = express.Router();

// Public/Common routes (Protected by Token)
router.get("/project/:projectId", verifyToken, getProjectFeedbacks);
router.get("/:feedbackId", verifyToken, getFeedback);
// Using POST for create/update logic (Upsert)
router.post("/:feedbackId/responses", verifyToken, requireRoles("client"), submitResponse);
router.get("/:feedbackId/my-response", verifyToken, requireRoles("client"), getUserResponse);
router.delete("/responses/:responseId", verifyToken, deleteResponse); // Shared delete (Owner or Manager)

// Manager / Req Engineer routes
router.post(
    "/",
    verifyToken,
    requireRoles("manager", "requirements_engineer"),
    createFeedback
);

router.put(
    "/:feedbackId",
    verifyToken,
    requireRoles("manager", "requirements_engineer"),
    updateFeedback
);

router.delete(
    "/:feedbackId",
    verifyToken,
    requireRoles("manager", "requirements_engineer"),
    deleteFeedback
);

router.get(
    "/:feedbackId/responses",
    verifyToken,
    requireRoles("manager", "requirements_engineer"),
    getResponses
);

export default router;
