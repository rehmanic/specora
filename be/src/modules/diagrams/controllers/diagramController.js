import asyncHandler from "../../../utils/asyncHandler.js";
import * as diagramService from "../services/diagramService.js";

// ─── CRUD ────────────────────────────────────────────────

export const listDiagrams = asyncHandler(async (req, res) => {
    const diagrams = await diagramService.listDiagrams(req.params.projectId);
    res.json({ diagrams });
});

export const createDiagram = asyncHandler(async (req, res) => {
    const diagram = await diagramService.createDiagram(req.params.projectId, req.body.title);
    res.status(201).json(diagram);
});

export const getDiagram = asyncHandler(async (req, res) => {
    const diagram = await diagramService.getDiagram(req.params.projectId, req.params.diagramId);
    res.json(diagram);
});

export const updateDiagram = asyncHandler(async (req, res) => {
    const diagram = await diagramService.updateDiagram(req.params.projectId, req.params.diagramId, req.body);
    res.json(diagram);
});

export const deleteDiagram = asyncHandler(async (req, res) => {
    await diagramService.deleteDiagram(req.params.projectId, req.params.diagramId);
    res.json({ message: "Diagram deleted" });
});

// ─── AI Generation ────────────────────────────────────────

export const generateFromDescription = asyncHandler(async (req, res) => {
    const result = await diagramService.generateFromDescription(req.params.projectId, req.body);
    res.json(result);
});

export const editDiagram = asyncHandler(async (req, res) => {
    const result = await diagramService.editDiagram(req.params.projectId, req.body);
    res.json(result);
});

// ─── Diagram-Requirement Linking ─────────────────────────

export const updateDiagramRequirements = asyncHandler(async (req, res) => {
    await diagramService.updateDiagramRequirements(req.params.projectId, req.params.diagramId, req.body.requirement_ids);
    res.json({ message: "Requirement links updated" });
});
