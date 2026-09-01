import prisma from "../../../config/db/prismaClient.js";
import { resolveProjectId } from "../../utils/resolveProjectId.js";
import { generateStatelessResponse } from "../../utils/gemini.js";
import {
    generateDiagramPrompt,
    generateDiagramTask,
    generateDiagramExpectations,
    generateDiagramOutput,
    editDiagramContent,
    editDiagramTask,
    editDiagramExpectations,
    editDiagramOutput
} from "../../utils/prompts/diagramPrompts.js";

// ─── Helpers ──────────────────────────────────────────────

/** Strip optional markdown code fence from AI response (e.g. ```mermaid ... ```) */
function extractMermaidCode(text) {
    if (!text || typeof text !== "string") return "";
    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/^```(?:mermaid)?\s*([\s\S]*?)```$/im);
    return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

// ─── CRUD ────────────────────────────────────────────────

export async function listDiagrams(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const diagrams = await prisma.diagram.findMany({
            where: { project_id: resolvedId },
            orderBy: { updated_at: "desc" },
        });

        res.json({ diagrams });
    } catch (err) {
        console.error("listDiagrams error:", err);
        res.status(500).json({ message: "Failed to fetch diagrams" });
    }
}

export async function createDiagram(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { title } = req.body;

        const diagram = await prisma.diagram.create({
            data: {
                project_id: resolvedId,
                title: title?.trim() || "Untitled diagram",
                mermaid_code: "",
            },
        });

        res.status(201).json(diagram);
    } catch (err) {
        console.error("createDiagram error:", err);
        res.status(500).json({ message: "Failed to create diagram" });
    }
}

export async function getDiagram(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { diagramId } = req.params;

        const diagram = await prisma.diagram.findFirst({
            where: { id: diagramId, project_id: resolvedId },
            include: {
                requirement_links: {
                    include: {
                        requirement: {
                            select: { id: true, readable_id: true, title: true }
                        }
                    }
                }
            }
        });

        if (!diagram) return res.status(404).json({ message: "Diagram not found" });
        res.json(diagram);
    } catch (err) {
        console.error("getDiagram error:", err);
        res.status(500).json({ message: "Failed to fetch diagram" });
    }
}

export async function updateDiagram(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { diagramId } = req.params;
        const { title, mermaid_code } = req.body;
        const mermaidCode = typeof mermaid_code === "string" ? mermaid_code : "";

        const diagram = await prisma.diagram.updateMany({
            where: { id: diagramId, project_id: resolvedId },
            data: {
                ...(title !== undefined && { title: title?.trim() ?? null }),
                ...(mermaid_code !== undefined && { mermaid_code: mermaidCode }),
                updated_at: new Date(),
            },
        });

        if (diagram.count === 0) return res.status(404).json({ message: "Diagram not found" });

        const updated = await prisma.diagram.findUnique({
            where: { id: diagramId },
        });
        res.json(updated);
    } catch (err) {
        console.error("updateDiagram error:", err);
        if (err.code === "P2025") return res.status(404).json({ message: "Diagram not found" });
        res.status(500).json({ message: "Failed to update diagram" });
    }
}

export async function deleteDiagram(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { diagramId } = req.params;

        const result = await prisma.diagram.deleteMany({
            where: { id: diagramId, project_id: resolvedId },
        });

        if (result.count === 0) return res.status(404).json({ message: "Diagram not found" });
        res.json({ message: "Diagram deleted" });
    } catch (err) {
        console.error("deleteDiagram error:", err);
        res.status(500).json({ message: "Failed to delete diagram" });
    }
}

// ─── AI: Generate Mermaid from description ────────────────

export async function generateFromDescription(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { diagram_type, requirement_ids } = req.body;
        if (!diagram_type || typeof diagram_type !== "string" || !diagram_type.trim()) {
            return res.status(400).json({ message: "Diagram type is required" });
        }
        if (!Array.isArray(requirement_ids) || requirement_ids.length === 0) {
            return res.status(400).json({ message: "At least one requirement must be selected" });
        }

        const reqs = await prisma.requirement.findMany({
            where: { id: { in: requirement_ids }, project_id: resolvedId },
            select: { readable_id: true, title: true, description: true }
        });

        if (reqs.length === 0) {
            return res.status(400).json({ message: "Selected requirements not found" });
        }

        const reqText = reqs.map(r => `[${r.readable_id}] ${r.title}: ${r.description}`).join("\n");
        const prompt = generateDiagramPrompt(diagram_type, reqText);

        const start = Date.now();
        const raw = await generateStatelessResponse(prompt, {
            task: generateDiagramTask(diagram_type),
            expectations: generateDiagramExpectations,
            output: generateDiagramOutput,
        });
        const end = Date.now();
        const cycle_time = end - start;

        const mermaid_code = extractMermaidCode(raw);
        res.json({ mermaid_code, cycle_time });
    } catch (err) {
        console.error("generateFromDescription error:", err);
        res.status(500).json({ message: err.message || "Failed to generate diagram" });
    }
}

// ─── AI: Edit existing Mermaid from instruction ───────────

export async function editDiagram(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { current_mermaid_code, edit_instruction } = req.body;
        if (!edit_instruction || typeof edit_instruction !== "string" || !edit_instruction.trim()) {
            return res.status(400).json({ message: "Edit instruction is required" });
        }

        const currentCode = typeof current_mermaid_code === "string" ? current_mermaid_code : "";

        const content = editDiagramContent(currentCode, edit_instruction);

        const raw = await generateStatelessResponse(content, {
            task: editDiagramTask,
            expectations: editDiagramExpectations,
            output: editDiagramOutput,
        });

        const mermaid_code = extractMermaidCode(raw);
        res.json({ mermaid_code });
    } catch (err) {
        console.error("editDiagram error:", err);
        res.status(500).json({ message: err.message || "Failed to edit diagram" });
    }
}

// ─── Diagram-Requirement Linking ─────────────────────────

export async function updateDiagramRequirements(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { diagramId } = req.params;
        const { requirement_ids } = req.body; // Array of UUIDs

        if (!Array.isArray(requirement_ids)) {
            return res.status(400).json({ message: "requirement_ids must be an array" });
        }

        // 1. Delete existing links
        await prisma.diagram_requirement.deleteMany({
            where: { diagram_id: diagramId }
        });

        // 2. Create new links
        if (requirement_ids.length > 0) {
            await prisma.diagram_requirement.createMany({
                data: requirement_ids.map(rid => ({
                    diagram_id: diagramId,
                    requirement_id: rid
                }))
            });
        }

        res.json({ message: "Requirement links updated" });
    } catch (err) {
        console.error("updateDiagramRequirements error:", err);
        res.status(500).json({ message: "Failed to update requirement links" });
    }
}
