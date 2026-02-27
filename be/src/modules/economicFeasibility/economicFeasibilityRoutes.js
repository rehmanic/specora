import express from "express";
import {
    getConfig,
    upsertConfig,
    getEstimates,
    upsertEstimates,
    simulate,
} from "./economicFeasibilityController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// Config
router.get("/config/:projectId", getConfig);
router.put("/config/:projectId", upsertConfig);

// Estimates
router.get("/estimates/:projectId", getEstimates);
router.put("/estimates/:projectId", upsertEstimates);

// Simulation
router.post("/simulate/:projectId", simulate);

export default router;
