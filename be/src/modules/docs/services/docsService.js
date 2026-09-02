import * as docsRepo from "../repositories/docsRepository.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";
import { generateStatelessResponse } from "../../../utils/gemini.js";
import { generatePDF, generateDOCX } from "../../../utils/docExporter.js";
import AppError from "../../../utils/AppError.js";
import {
    srsExpectationsPrompt,
    srsOutputPrompt,
    useCaseExpectationsPrompt,
    useCaseOutputPrompt,
    buildUseCaseContentPrompt,
    buildSrsContentPrompt,
    editDocumentContentPrompt,
    editDocumentExpectationsPrompt
} from "../../../utils/prompts/docPrompts.js";

// ─── HELPERS ──────────────────────────────────────────────

function buildTemplateInstructions(docType, coveredScenariosText = "") {
    if (docType === "srs") {
        return { expectations: srsExpectationsPrompt, output: srsOutputPrompt };
    }
    if (docType === "use_case") {
        return { expectations: useCaseExpectationsPrompt, output: useCaseOutputPrompt };
    }
    throw new AppError(`Unsupported document type for AI generation: "${docType}"`, 400);
}

// ─── CRUD ────────────────────────────────────────────────

export async function createDoc(projectId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, content, type } = data;
    const normalizedType = type?.toLowerCase();

    const validTypes = ["srs", "use_case"];
    if (normalizedType && !validTypes.includes(normalizedType)) {
        throw new AppError(`Invalid document type "${normalizedType}". Allowed types: srs, use_case.`, 400);
    }

    if (normalizedType === "srs") {
        const existingSrs = await docsRepo.findDocumentByType(resolvedId, "srs");
        if (existingSrs) {
            throw new AppError("A project can only have one SRS document.", 400);
        }
    }

    return await docsRepo.createDocumentRecord({
        project_id: resolvedId,
        title: title || "Untitled Document",
        content: content || "",
        type: normalizedType || "use_case",
    });
}

export async function getDocs(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await docsRepo.findDocumentsByProject(resolvedId);
}

export async function getDocById(projectId, docId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const doc = await docsRepo.findDocumentById(docId, resolvedId);

    if (!doc) throw new AppError("Doc not found", 404);
    return doc;
}

export async function updateDoc(projectId, docId, data) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, content, type } = data;
    const normalizedType = type?.toLowerCase();

    const doc = await docsRepo.findDocumentById(docId, resolvedId);
    if (!doc) throw new AppError("Doc not found", 404);

    if (normalizedType === "srs" && doc.type !== "srs") {
        const existingSrs = await docsRepo.findDocumentByType(resolvedId, "srs");
        if (existingSrs) {
            throw new AppError("A project can only have one SRS document.", 400);
        }
    }

    return await docsRepo.updateDocumentRecord(docId, { 
        title, 
        content, 
        type: normalizedType, 
        updated_at: new Date() 
    });
}

export async function deleteDoc(projectId, docId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const doc = await docsRepo.findDocumentById(docId, resolvedId);
    if (!doc) throw new AppError("Doc not found", 404);

    await docsRepo.deleteDocumentRecord(docId);
}

export async function updateDocRequirements(projectId, docId, requirementIds) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const doc = await docsRepo.findDocumentById(docId, resolvedId);
    if (!doc) throw new AppError("Doc not found", 404);

    await docsRepo.updateDocumentRequirements(docId, requirementIds);
}

// ─── AI Generation ────────────────────────────────────────

export async function generateDoc(projectId, docId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const doc = await docsRepo.findDocumentById(docId, resolvedId);
    if (!doc) throw new AppError("Doc not found", 404);

    const allRequirements = await docsRepo.findAllProjectRequirements(resolvedId);

    if (allRequirements.length === 0) {
        throw new AppError("No requirements found for this project. Please add requirements before generating a document.", 400);
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
        const siblingDocs = await docsRepo.findSiblingDocs(resolvedId, "use_case", docId);

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

    return { content: generatedContent, cycle_time };
}

export async function editDocWithAI(projectId, docId, editInstructions, currentContent) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!editInstructions?.trim()) {
        throw new AppError("Edit instructions are required.", 400);
    }

    const doc = await prisma.doc.findFirst({
        where: { id: docId, project_id: resolvedId },
    });
    if (!doc) throw new AppError("Doc not found", 404);

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

    return { content: editedContent, cycle_time };
}

// ─── Export ───────────────────────────────────────────────

export async function exportDoc(projectId, docId, format) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const doc = await prisma.doc.findFirst({ where: { id: docId, project_id: resolvedId } });
    if (!doc) throw new AppError("Doc not found", 404);

    const slug = (doc.title || "document").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    let buffer;
    let mimeType;

    if (format === "pdf") {
        buffer = await generatePDF(doc);
        mimeType = "application/pdf";
    } else if (format === "docx") {
        buffer = await generateDOCX(doc);
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else {
        throw new AppError(`Unsupported format: "${format}". Use pdf or docx.`, 400);
    }

    return { buffer, mimeType, filename: `${slug}.${format}` };
}
