import express from "express";
import { search } from "./techFeasibilityController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

router.use(verifyToken);

// Search
router.post("/search/:projectId", requirePermissions("view_technical_feasibility"), search);

export default router;
