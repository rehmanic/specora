import asyncHandler from "../../../utils/asyncHandler.js";
import * as techFeasibilityService from "../services/techFeasibilityService.js";

export const search = asyncHandler(async (req, res) => {
    const result = await techFeasibilityService.searchTechFeasibility(req.params.projectId, req.body.query);
    res.status(200).json({
        message: "Search completed successfully",
        ...result,
    });
});
