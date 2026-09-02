import * as diagramRepo from "../repositories/diagramRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";
import { generateStatelessResponse } from "../../../utils/gemini.js";
import {
    generateDiagramPrompt,
    generateDiagramTask,
    generateDiagramExpectations,
    generateDiagramOutput,
    editDiagramContent,
    editDiagramTask,
    editDiagramExpectations,
    editDiagramOutput
} from "../../../utils/prompts/diagramPrompts.js";

// ─── Helpers ──────────────────────────────────────────────

function extractMermaidCode(text) {
    if (!text || typeof text !== "string") return "";
    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/^```(?:mermaid)?\s*([\s\S]*?)```$/im);
    return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

// ─── CRUD ────────────────────────────────────────────────

export async function listDiagrams(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await diagramRepo.findDiagramsByProject(resolvedId);
}

export async function createDiagram(projectId, title) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await diagramRepo.createDiagram({
        project_id: resolvedId,
        title: title?.trim() || "Untitled diagram",
        mermaid_code: "",
    });
}

export async function getDiagram(projectId, diagramId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const diagram = await diagramRepo.findDiagramById(diagramId, resolvedId);

    if (!diagram) throw new AppError("Diagram not found", 404);
    return diagram;
}

export async function updateDiagram(projectId, diagramId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, mermaid_code } = data;
    const mermaidCode = typeof mermaid_code === "string" ? mermaid_code : "";

    const count = await diagramRepo.updateDiagramRecord(diagramId, resolvedId, {
        ...(title !== undefined && { title: title?.trim() ?? null }),
        ...(mermaid_code !== undefined && { mermaid_code: mermaidCode }),
    });

    if (count === 0) throw new AppError("Diagram not found", 404);

    return await diagramRepo.findDiagramByIdSimple(diagramId);
}

export async function deleteDiagram(projectId, diagramId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const count = await diagramRepo.deleteDiagramRecord(diagramId, resolvedId);

    if (count === 0) throw new AppError("Diagram not found", 404);
}

// ─── AI Generation ────────────────────────────────────────

export async function generateFromDescription(projectId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { diagram_type, requirement_ids } = data;
    if (!diagram_type || typeof diagram_type !== "string" || !diagram_type.trim()) {
        throw new AppError("Diagram type is required", 400);
    }
    if (!Array.isArray(requirement_ids) || requirement_ids.length === 0) {
        throw new AppError("At least one requirement must be selected", 400);
    }

    const reqs = await diagramRepo.findRequirementsForDiagram(requirement_ids, resolvedId);

    if (reqs.length === 0) {
        throw new AppError("Selected requirements not found", 400);
    }

    const reqText = reqs.map(r => `[${r.readable_id}] ${r.title}: ${r.description}`).join("\n");
    const prompt = generateDiagramPrompt(diagram_type, reqText);

    const start = Date.now();
    const raw = await generateStatelessResponse(prompt, {
        task: generateDiagramTask(diagram_type),
        expectations: generateDiagramExpectations,
        output: generateDiagramOutput,
    });
    const cycle_time = Date.now() - start;

    return { mermaid_code: extractMermaidCode(raw), cycle_time };
}

export async function editDiagram(projectId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { current_mermaid_code, edit_instruction } = data;
    if (!edit_instruction || typeof edit_instruction !== "string" || !edit_instruction.trim()) {
        throw new AppError("Edit instruction is required", 400);
    }

    const currentCode = typeof current_mermaid_code === "string" ? current_mermaid_code : "";
    const content = editDiagramContent(currentCode, edit_instruction);

    const raw = await generateStatelessResponse(content, {
        task: editDiagramTask,
        expectations: editDiagramExpectations,
        output: editDiagramOutput,
    });

    return { mermaid_code: extractMermaidCode(raw) };
}

// ─── Diagram-Requirement Linking ─────────────────────────

export async function updateDiagramRequirements(projectId, diagramId, requirement_ids) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!Array.isArray(requirement_ids)) {
        throw new AppError("requirement_ids must be an array", 400);
    }

    await diagramRepo.updateDiagramRequirementsTransaction(diagramId, requirement_ids);
}
