import express from "express";
import { health, checkSingle, checkBatch, loadResources } from "./legalFeasibilityController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

// Load FAISS index, embedding model, and chunk data on first import
loadResources().catch((err) => {
    console.error("Failed to initialize legal feasibility resources:", err);
});

// Health check (no auth required)
router.get("/health", health);

// Protected routes
router.use(verifyToken);

router.post("/single", requirePermissions("view_feasibility_studies"), checkSingle);
router.post("/batch", requirePermissions("view_feasibility_studies"), checkBatch);

export default router;
