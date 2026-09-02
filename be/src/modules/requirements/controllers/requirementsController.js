import asyncHandler from "../../../utils/asyncHandler.js";
import * as requirementsService from "../services/requirementsService.js";

// Core CRUD
export const getProjectRequirements = asyncHandler(async (req, res) => {
    const requirements = await requirementsService.getProjectRequirements(req.params.projectId, req.query);
    res.status(200).json({
        message: "Requirements fetched successfully",
        count: requirements.length,
        requirements,
    });
});

export const createRequirement = asyncHandler(async (req, res) => {
    const requirement = await requirementsService.createRequirement(req.params.projectId, req.body, req.user?.userId || req.user?.id);
    res.status(201).json({
        message: "Requirement created successfully",
        requirement,
    });
});

export const updateRequirement = asyncHandler(async (req, res) => {
    const result = await requirementsService.updateRequirement(req.params.requirementId, req.body, req.user?.userId || req.user?.id);
    if (result.no_changes) {
        res.status(200).json({
            message: "No changes detected",
            requirement: result.requirement
        });
    } else {
        res.status(200).json({
            message: "Requirement updated successfully",
            requirement: result.requirement,
        });
    }
});

export const deleteRequirement = asyncHandler(async (req, res) => {
    await requirementsService.deleteRequirement(req.params.requirementId);
    res.status(200).json({ message: "Requirement deleted successfully" });
});

// History & Rollback
export const getRequirementHistory = asyncHandler(async (req, res) => {
    const history = await requirementsService.getRequirementHistory(req.params.requirementId);
    res.status(200).json({ history });
});

export const rollbackRequirement = asyncHandler(async (req, res) => {
    const requirement = await requirementsService.rollbackRequirement(req.params.requirementId, req.params.historyId, req.user?.userId || req.user?.id);
    res.status(200).json({ message: "Rollback successful", requirement });
});

// Comments
export const getComments = asyncHandler(async (req, res) => {
    const comments = await requirementsService.getComments(req.params.requirementId);
    res.status(200).json({ comments });
});

export const addComment = asyncHandler(async (req, res) => {
    const comment = await requirementsService.addComment(req.params.requirementId, req.body, req.user?.userId || req.user?.id);
    res.status(201).json({ message: "Comment added", comment });
});

// Traceability
export const getTraceabilityLinks = asyncHandler(async (req, res) => {
    const links = await requirementsService.getTraceabilityLinks(req.params.requirementId);
    res.status(200).json({ links });
});

export const createTraceabilityLink = asyncHandler(async (req, res) => {
    const link = await requirementsService.createTraceabilityLink(req.params.requirementId, req.body, req.user?.userId || req.user?.id);
    res.status(201).json({ message: "Link created", link });
});

export const deleteTraceabilityLink = asyncHandler(async (req, res) => {
    await requirementsService.deleteTraceabilityLink(req.params.linkId, req.user?.userId || req.user?.id);
    res.status(200).json({ message: "Link deleted" });
});

export const getProjectTraceabilityGraph = asyncHandler(async (req, res) => {
    const data = await requirementsService.getProjectTraceabilityGraph(req.params.projectId);
    res.status(200).json(data);
});

// Import
export const importRequirements = asyncHandler(async (req, res) => {
    const result = await requirementsService.importRequirements(req.params.projectId, req.body.requirements, req.user?.userId || req.user?.id);
    res.status(201).json({
        message: `Import completed. ${result.created_count} requirement(s) created.`,
        created_count: result.created_count,
        errors: result.errors,
    });
});
