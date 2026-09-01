import prisma from "../../../config/db/prismaClient.js";
import { generateStatelessResponse } from "../../utils/gemini.js";
import { generatePDF, generateDOCX } from "../../utils/docExporter.js";
import {
    srsExpectationsPrompt,
    srsOutputPrompt,
    useCaseExpectationsPrompt,
    useCaseOutputPrompt,
    buildUseCaseContentPrompt,
    buildSrsContentPrompt,
    editDocumentContentPrompt,
    editDocumentExpectationsPrompt
} from "../../utils/prompts/docPrompts.js";

async function resolveProjectId(projectId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    if (isUuid) return projectId;

    const project = await prisma.project.findFirst({
        where: { slug: projectId },
        select: { id: true },
    });
    return project?.id ?? null;
}

// CREATE
export const createDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { title, content, type } = req.body;
        const normalizedType = type?.toLowerCase();

        const validTypes = ["srs", "use_case"];
        if (normalizedType && !validTypes.includes(normalizedType)) {
            return res.status(400).json({
                status: "error",
                message: `Invalid document type "${normalizedType}". Allowed types: srs, use_case.`,
            });
        }

        if (normalizedType === "srs") {
            const existingSrs = await prisma.doc.findFirst({
                where: { project_id: resolvedId, type: "srs" },
            });
            if (existingSrs) {
                return res.status(400).json({
                    status: "error",
                    message: "A project can only have one SRS document.",
                });
            }
        }

        const doc = await prisma.doc.create({
            data: {
                project_id: resolvedId,
                title,
                content: content || "",
                type: normalizedType || "use_case",
            },
        });

        res.status(201).json({
            status: "success",
            doc,
        });
    } catch (err) {
        next(err);
    }
};

// READ ALL
export const getDocs = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const docs = await prisma.doc.findMany({
            where: { project_id: resolvedId },
            orderBy: { updated_at: "desc" },
        });

        res.status(200).json({
            status: "success",
            results: docs.length,
            docs,
        });
    } catch (err) {
        next(err);
    }
};

// READ ONE
export const getDocById = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;

        const doc = await prisma.doc.findFirst({
            where: {
                id: id,
                project_id: resolvedId,
            },
            include: {
                requirement_links: {
                    include: {
                        requirement: true
                    }
                }
            }
        });

        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        res.status(200).json({
            status: "success",
            doc,
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;
        const { title, content, type } = req.body;
        const normalizedType = type?.toLowerCase();

        const doc = await prisma.doc.findFirst({
            where: { id: id, project_id: resolvedId },
        });
        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        if (normalizedType === "srs" && doc.type !== "srs") {
            const existingSrs = await prisma.doc.findFirst({
                where: { project_id: resolvedId, type: "srs" },
            });
            if (existingSrs) {
                return res.status(400).json({
                    status: "error",
                    message: "A project can only have one SRS document.",
                });
            }
        }

        const updatedDoc = await prisma.doc.update({
            where: { id: id },
            data: { title, content, type: normalizedType, updated_at: new Date() },
        });

        res.status(200).json({
            status: "success",
            doc: updatedDoc,
        });
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;

        const doc = await prisma.doc.findFirst({
            where: { id: id, project_id: resolvedId },
        });
        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        await prisma.doc.delete({
            where: { id: id },
        });

        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

// LINK REQUIREMENTS
export const updateDocRequirements = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;
        const { requirementIds } = req.body;

        const doc = await prisma.doc.findFirst({
            where: { id, project_id: resolvedId },
        });

        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        // Transactions to delete old links and create new ones
        await prisma.$transaction([
            prisma.doc_requirement.deleteMany({
                where: { doc_id: id }
            }),
            prisma.doc_requirement.createMany({
                data: (requirementIds || []).map(rid => ({
                    doc_id: id,
                    requirement_id: rid
                }))
            })
        ]);

        res.status(200).json({
            status: "success",
            message: "Requirements links updated",
        });
    } catch (err) {
        next(err);
    }
};

// ─── AI: GENERATE DOCUMENT ───────────────────────────────────────────────────
// POST /docs/:projectId/:id/generate
export const generateDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;

        // Load the current document
        const doc = await prisma.doc.findFirst({
            where: { id, project_id: resolvedId },
        });

        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        // Fetch ALL project requirements
        const allRequirements = await prisma.requirement.findMany({
            where: { project_id: resolvedId },
            select: {
                title: true,
                description: true,
                priority: true,
                status: true,
                category: true,
            },
            orderBy: { created_at: "asc" },
        });

        if (allRequirements.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No requirements found for this project. Please add requirements before generating a document.",
            });
        }

        const requirementsText = allRequirements
            .map((r, i) => {
                const parts = [`${i + 1}. [${(r.priority || "medium").toUpperCase()}] ${r.title}`];
                if (r.description) parts.push(`   Description: ${r.description}`);
                if (r.category) parts.push(`   Category: ${r.category}`);
                if (r.status) parts.push(`   Status: ${r.status}`);
                return parts.join("\n");
            })
            .join("\n\n");

        let content;
        let templateInstructions;

        if (doc.type === "use_case") {
            // Fetch all OTHER use_case docs for this project — titles only
            const siblingDocs = await prisma.doc.findMany({
                where: {
                    project_id: resolvedId,
                    type: "use_case",
                    id: { not: id },
                },
                select: { title: true, content: true },
                orderBy: { created_at: "asc" },
            });

            // Extract the <h1> use case name from each generated sibling.
            // Ungenerated docs (no content/no h1) are skipped — they haven’t claimed a scenario yet.
            const h1Regex = /<h1[^>]*>([^<]+)<\/h1>/i;
            const coveredNames = siblingDocs
                .map(d => {
                    const match = d.content && h1Regex.exec(d.content);
                    return match ? match[1].trim() : null;
                })
                .filter(Boolean);

            const coveredScenariosText = coveredNames.length > 0
                ? coveredNames.map((name, i) => `${i + 1}. ${name}`).join("\n")
                : "None — this is the first use case document for this project.";

            templateInstructions = buildTemplateInstructions("use_case", coveredScenariosText);

            content = buildUseCaseContentPrompt(coveredScenariosText, allRequirements.length, requirementsText);
        } else {
            // SRS — use all requirements
            templateInstructions = buildTemplateInstructions("srs");
            content = buildSrsContentPrompt(allRequirements.length, requirementsText, doc.title);
        }

        const instructions = {
            task: "generate_document",
            expectations: templateInstructions.expectations,
            output: templateInstructions.output,
            jsonMode: false,
        };

        const startTime = Date.now();
        const generatedContent = await generateStatelessResponse(content, instructions);
        const cycle_time = Date.now() - startTime;

        res.status(200).json({
            status: "success",
            content: generatedContent,
            cycle_time,
        });
    } catch (err) {
        next(err);
    }
};

// ─── AI: EDIT DOCUMENT ───────────────────────────────────────────────────────
// POST /docs/:projectId/:id/edit-with-ai
export const editDocWithAI = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) {
            return res.status(404).json({ status: "error", message: "Project not found" });
        }

        const { id } = req.params;
        const { editInstructions, currentContent } = req.body;

        if (!editInstructions?.trim()) {
            return res.status(400).json({
                status: "error",
                message: "Edit instructions are required.",
            });
        }

        const doc = await prisma.doc.findFirst({
            where: { id, project_id: resolvedId },
        });

        if (!doc) {
            return res.status(404).json({ status: "error", message: "Doc not found" });
        }

        const templateInstructions = buildTemplateInstructions(doc.type);

        const content = editDocumentContentPrompt(doc.title, doc.type.toUpperCase(), editInstructions, currentContent || "(empty document)");

        const instructions = {
            task: "edit_document",
            expectations: editDocumentExpectationsPrompt(doc.type.toUpperCase(), templateInstructions.expectations),
            output: templateInstructions.output,
            jsonMode: false,
        };

        const startTime = Date.now();
        const editedContent = await generateStatelessResponse(content, instructions);
        const cycle_time = Date.now() - startTime;

        res.status(200).json({
            status: "success",
            content: editedContent,
            cycle_time,
        });
    } catch (err) {
        next(err);
    }
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildTemplateInstructions(docType, coveredScenariosText = "") {
    if (docType === "srs") {
        return {
            expectations: srsExpectationsPrompt,
            output: srsOutputPrompt,
        };
    }

    if (docType === "use_case") {
        return {
            expectations: useCaseExpectationsPrompt,
            output: useCaseOutputPrompt,
        };
    }

    throw new Error(`Unsupported document type for AI generation: "${docType}"`);
}
// ─── EXPORT DOC (PDF / DOCX) ──────────────────────────────────────────────
// GET /docs/:projectId/:id/export/:format  (format = pdf | docx)
export const exportDoc = async (req, res, next) => {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ status: "error", message: "Project not found" });

        const { id, format } = req.params;

        const doc = await prisma.doc.findFirst({ where: { id, project_id: resolvedId } });
        if (!doc) return res.status(404).json({ status: "error", message: "Doc not found" });

        const slug = (doc.title || "document").replace(/[^a-z0-9]+/gi, "_").toLowerCase();

        if (format === "pdf") {
            const buffer = await generatePDF(doc);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${slug}.pdf"`);
            return res.send(buffer);
        }

        if (format === "docx") {
            const buffer = await generateDOCX(doc);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", `attachment; filename="${slug}.docx"`);
            return res.send(buffer);
        }

        return res.status(400).json({ status: "error", message: `Unsupported format: "${format}". Use pdf or docx.` });
    } catch (err) {
        next(err);
    }
};
