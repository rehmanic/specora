import express from "express";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";
import { verifyARM, verifyAI, verifyARMRequirement, verifyAIRequirement } from "./verificationController.js";

const router = express.Router();

router.use(verifyToken);

// ARM Verification routes
router.post("/arm/:projectId", requirePermissions("run_verification_checks"), verifyARM);
router.post("/arm/:projectId/requirement/:requirementId", requirePermissions("run_verification_checks"), verifyARMRequirement);

// AI Verification routes
router.post("/ai/:projectId", requirePermissions("run_verification_checks"), verifyAI);
router.post("/ai/:projectId/requirement/:requirementId", requirePermissions("run_verification_checks"), verifyAIRequirement);

export default router;
