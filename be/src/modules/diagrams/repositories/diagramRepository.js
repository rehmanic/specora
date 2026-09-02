import prisma from "../../../config/db/prismaClient.js";

// ─── Diagram CRUD ─────────────────────────────────────────

export async function findDiagramsByProject(projectId) {
    return await prisma.diagram.findMany({
        where: { project_id: projectId },
        orderBy: { updated_at: "desc" },
    });
}

export async function createDiagram(data) {
    return await prisma.diagram.create({ data });
}

export async function findDiagramById(diagramId, projectId) {
    return await prisma.diagram.findFirst({
        where: { id: diagramId, project_id: projectId },
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
}

export async function findDiagramByIdSimple(diagramId) {
    return await prisma.diagram.findUnique({ where: { id: diagramId } });
}

export async function updateDiagramRecord(diagramId, projectId, data) {
    const result = await prisma.diagram.updateMany({
        where: { id: diagramId, project_id: projectId },
        data: { ...data, updated_at: new Date() },
    });
    return result.count;
}

export async function deleteDiagramRecord(diagramId, projectId) {
    const result = await prisma.diagram.deleteMany({
        where: { id: diagramId, project_id: projectId },
    });
    return result.count;
}

// ─── Requirements ─────────────────────────────────────────

export async function findRequirementsForDiagram(requirementIds, projectId) {
    return await prisma.requirement.findMany({
        where: { id: { in: requirementIds }, project_id: projectId },
        select: { readable_id: true, title: true, description: true }
    });
}

export async function updateDiagramRequirementsTransaction(diagramId, requirementIds) {
    return await prisma.$transaction(async (tx) => {
        await tx.diagram_requirement.deleteMany({
            where: { diagram_id: diagramId }
        });

        if (requirementIds.length > 0) {
            await tx.diagram_requirement.createMany({
                data: requirementIds.map(rid => ({
                    diagram_id: diagramId,
                    requirement_id: rid
                }))
            });
        }
    });
}
