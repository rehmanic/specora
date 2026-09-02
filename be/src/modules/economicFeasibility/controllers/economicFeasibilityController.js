import asyncHandler from "../../../utils/asyncHandler.js";
import * as economicFeasibilityService from "../services/economicFeasibilityService.js";

// ─── Config Endpoints ─────────────────────────────────────

export const getConfig = asyncHandler(async (req, res) => {
    const config = await economicFeasibilityService.getConfig(req.params.projectId);
    res.status(200).json({ message: "Config fetched successfully", config });
});

export const upsertConfig = asyncHandler(async (req, res) => {
    const config = await economicFeasibilityService.upsertConfig(req.params.projectId, req.body);
    res.status(200).json({ message: "Config saved successfully", config });
});

// ─── Estimates Endpoints ──────────────────────────────────

export const getEstimates = asyncHandler(async (req, res) => {
    const estimates = await economicFeasibilityService.getEstimates(req.params.projectId);
    res.status(200).json({ message: "Estimates fetched successfully", estimates });
});

export const upsertEstimates = asyncHandler(async (req, res) => {
    const count = await economicFeasibilityService.upsertEstimates(req.params.projectId, req.body.estimates);
    res.status(200).json({ message: "Estimates saved successfully", count });
});

// ─── Simulation Endpoint ──────────────────────────────────

export const simulate = asyncHandler(async (req, res) => {
    const result = await economicFeasibilityService.simulate(req.params.projectId, req.body?.iterations);
    res.status(200).json({
        message: "Simulation completed successfully",
        ...result,
    });
});
