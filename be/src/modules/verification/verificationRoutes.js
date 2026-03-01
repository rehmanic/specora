import express from "express";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { verifyARM, verifyAI, verifyARMRequirement, verifyAIRequirement } from "./verificationController.js";

const router = express.Router();

router.use(verifyToken);

// ARM Verification routes
router.post("/arm/:projectId", verifyARM);
router.post("/arm/:projectId/requirement/:requirementId", verifyARMRequirement);

// AI Verification routes
router.post("/ai/:projectId", verifyAI);
router.post("/ai/:projectId/requirement/:requirementId", verifyAIRequirement);

export default router;
