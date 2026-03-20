import express from "express";
import {
    getConfig,
    upsertConfig,
    getEstimates,
    upsertEstimates,
    simulate,
} from "./economicFeasibilityController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

router.use(verifyToken);

// Config
router.get("/config/:projectId", requirePermissions("view_feasibility_studies"), getConfig);
router.put("/config/:projectId", requirePermissions("manage_economic_config"), upsertConfig);

// Estimates
router.get("/estimates/:projectId", requirePermissions("view_feasibility_studies"), getEstimates);
router.put("/estimates/:projectId", requirePermissions("manage_economic_estimates"), upsertEstimates);

// Simulation
router.post("/simulate/:projectId", requirePermissions("run_economic_simulations"), simulate);

export default router;
