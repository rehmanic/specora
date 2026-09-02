import asyncHandler from "../../../utils/asyncHandler.js";
import * as legalFeasibilityService from "../services/legalFeasibilityService.js";

// Export loadResources for use in the router
export const loadResources = async () => {
    return await legalFeasibilityService.loadResources();
};

export const health = (req, res) => {
    const status = legalFeasibilityService.getHealthStatus();
    res.json(status);
};

export const checkSingle = asyncHandler(async (req, res) => {
    const { id, title, description } = req.body;
    const result = await legalFeasibilityService.checkSingleRequirement(id, title, description);
    res.json(result);
});

export const checkBatch = asyncHandler(async (req, res) => {
    const { requirements } = req.body;
    const results = await legalFeasibilityService.checkBatchRequirements(requirements);
    res.json({ results });
});
