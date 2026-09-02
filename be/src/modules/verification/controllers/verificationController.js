import asyncHandler from "../../../utils/asyncHandler.js";
import * as verificationService from "../services/verificationService.js";

export const verifyARM = asyncHandler(async (req, res) => {
    const data = await verificationService.verifyARM(req.params.projectId);
    res.status(200).json({
        message: "ARM Verification completed successfully",
        ...data
    });
});

export const verifyARMRequirement = asyncHandler(async (req, res) => {
    const result = await verificationService.verifyARMRequirement(req.params.projectId, req.params.requirementId);
    res.status(200).json({
        message: "ARM Verification for requirement completed successfully",
        result
    });
});

export const verifyAI = asyncHandler(async (req, res) => {
    const data = await verificationService.verifyAI(req.params.projectId);
    res.status(200).json({
        message: "AI Verification completed successfully",
        ...data
    });
});

export const verifyAIRequirement = asyncHandler(async (req, res) => {
    const data = await verificationService.verifyAIRequirement(req.params.projectId, req.params.requirementId);
    res.status(200).json({
        message: "AI Verification for requirement completed successfully",
        ...data
    });
});
