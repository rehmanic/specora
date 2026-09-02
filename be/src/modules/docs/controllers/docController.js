import asyncHandler from "../../../utils/asyncHandler.js";
import * as docsService from "../services/docsService.js";

// CREATE
export const createDoc = asyncHandler(async (req, res) => {
    const doc = await docsService.createDoc(req.params.projectId, req.body);
    res.status(201).json({ status: "success", doc });
});

// READ ALL
export const getDocs = asyncHandler(async (req, res) => {
    const docs = await docsService.getDocs(req.params.projectId);
    res.status(200).json({ status: "success", results: docs.length, docs });
});

// READ ONE
export const getDocById = asyncHandler(async (req, res) => {
    const doc = await docsService.getDocById(req.params.projectId, req.params.id);
    res.status(200).json({ status: "success", doc });
});

// UPDATE
export const updateDoc = asyncHandler(async (req, res) => {
    const doc = await docsService.updateDoc(req.params.projectId, req.params.id, req.body);
    res.status(200).json({ status: "success", doc });
});

// DELETE
export const deleteDoc = asyncHandler(async (req, res) => {
    await docsService.deleteDoc(req.params.projectId, req.params.id);
    res.status(204).json({ status: "success", data: null });
});

// LINK REQUIREMENTS
export const updateDocRequirements = asyncHandler(async (req, res) => {
    await docsService.updateDocRequirements(req.params.projectId, req.params.id, req.body.requirementIds);
    res.status(200).json({ status: "success", message: "Requirements links updated" });
});

// ─── AI GENERATION ───────────────────────────────────────────────────────────

export const generateDoc = asyncHandler(async (req, res) => {
    const result = await docsService.generateDoc(req.params.projectId, req.params.id);
    res.status(200).json({ status: "success", ...result });
});

export const editDocWithAI = asyncHandler(async (req, res) => {
    const result = await docsService.editDocWithAI(req.params.projectId, req.params.id, req.body.editInstructions, req.body.currentContent);
    res.status(200).json({ status: "success", ...result });
});

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export const exportDoc = asyncHandler(async (req, res) => {
    const result = await docsService.exportDoc(req.params.projectId, req.params.id, req.params.format);
    res.setHeader("Content-Type", result.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    return res.send(result.buffer);
});
