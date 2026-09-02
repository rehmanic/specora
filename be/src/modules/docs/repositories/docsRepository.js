import prisma from "../../../../config/db/prismaClient.js";

// ─── Documents CRUD ───────────────────────────────────────

export async function findDocumentsByProject(projectId) {
    return await prisma.doc.findMany({
        where: { project_id: projectId },
        orderBy: { updated_at: "desc" }
    });
}

export async function createDocumentRecord(data) {
    return await prisma.doc.create({
        data
    });
}

export async function findDocumentById(docId, projectId) {
    return await prisma.doc.findFirst({
        where: { id: docId, project_id: projectId }
    });
}

export async function findDocumentByIdSimple(docId) {
    return await prisma.doc.findUnique({
        where: { id: docId }
    });
}

export async function updateDocumentRecord(docId, projectId, data) {
    const result = await prisma.doc.updateMany({
        where: { id: docId, project_id: projectId },
        data: { ...data, updated_at: new Date() },
    });
    return result.count;
}

export async function deleteDocumentRecord(docId, projectId) {
    const result = await prisma.doc.deleteMany({
        where: { id: docId, project_id: projectId },
    });
    return result.count;
}

// ─── Document AI Generation Fetching ──────────────────────

export async function fetchProjectContextForAI(projectId) {
    return await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            requirement: {
                select: {
                    readable_id: true,
                    title: true,
                    description: true,
                    priority: true,
                    status: true,
                    verification_status: true,
                },
                orderBy: { created_at: "asc" }
            },
            diagram: {
                select: {
                    title: true,
                    mermaid_code: true,
                }
            }
        }
    });
}

export async function findDocumentByType(projectId, type) {
    return await prisma.doc.findFirst({
        where: { project_id: projectId, type },
    });
}

export async function updateDocumentRequirements(docId, requirementIds) {
    return await prisma.$transaction([
        prisma.doc_requirement.deleteMany({ where: { doc_id: docId } }),
        prisma.doc_requirement.createMany({
            data: (requirementIds || []).map(rid => ({
                doc_id: docId,
                requirement_id: rid
            }))
        })
    ]);
}

export async function findAllProjectRequirements(projectId) {
    return await prisma.requirement.findMany({
        where: { project_id: projectId },
        select: { title: true, description: true, priority: true, status: true, category: true },
        orderBy: { created_at: "asc" },
    });
}

export async function findSiblingDocs(projectId, type, excludeDocId) {
    return await prisma.doc.findMany({
        where: { project_id: projectId, type, id: { not: excludeDocId } },
        select: { title: true, content: true },
        orderBy: { created_at: "asc" },
    });
}
