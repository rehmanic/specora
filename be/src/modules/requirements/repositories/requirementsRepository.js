import prisma from "../../../../config/db/prismaClient.js";

// ─── Requirements CRUD ────────────────────────────────────

export async function findRequirementsByProject(where) {
    return await prisma.requirement.findMany({
        where,
        orderBy: [
            { priority: "desc" },
            { created_at: "desc" },
        ],
        include: {
            children: true,
            owner: { select: { username: true, display_name: true } },
            _count: {
                select: { source_links: true, target_links: true }
            }
        },
    });
}

export async function createRequirementRecord(data) {
    return await prisma.requirement.create({
        data,
    });
}

export async function findRequirementById(reqId, projectId) {
    return await prisma.requirement.findFirst({
        where: { id: reqId, project_id: projectId }
    });
}

export async function updateRequirementRecord(reqId, projectId, data) {
    const result = await prisma.requirement.updateMany({
        where: { id: reqId, project_id: projectId },
        data: { ...data, updated_at: new Date() },
    });
    return result.count;
}

export async function deleteRequirementRecord(reqId, projectId) {
    const result = await prisma.requirement.deleteMany({
        where: { id: reqId, project_id: projectId },
    });
    return result.count;
}

// ─── Bulk Operations ──────────────────────────────────────

export async function bulkCreateRequirements(dataArray) {
    return await prisma.requirement.createMany({
        data: dataArray,
    });
}

export async function bulkUpdateRequirementsTransaction(updates, projectId) {
    return await prisma.$transaction(
        updates.map((update) =>
            prisma.requirement.updateMany({
                where: { id: update.id, project_id: projectId },
                data: { ...update.data, updated_at: new Date() },
            })
        )
    );
}

export async function bulkDeleteRequirements(reqIds, projectId) {
    return await prisma.requirement.deleteMany({
        where: {
            id: { in: reqIds },
            project_id: projectId,
        },
    });
}

export async function countProjectRequirements(projectId) {
    return await prisma.requirement.count({
        where: { project_id: projectId },
    });
}

// ─── Hierarchy / IDs ──────────────────────────────────────

export async function findRootRequirements(projectId) {
    return await prisma.requirement.findMany({
        where: { project_id: projectId, parent_id: null },
        select: { readable_id: true }
    });
}

export async function findChildRequirements(parentId) {
    return await prisma.requirement.findMany({
        where: { parent_id: parentId },
        select: { readable_id: true }
    });
}

// ─── History ──────────────────────────────────────────────

export async function countRequirementHistory(reqId) {
    return await prisma.requirement_history.count({
        where: { requirement_id: reqId }
    });
}

export async function createHistoryRecord(data) {
    return await prisma.requirement_history.create({ data });
}

export async function getHistoryByRequirementId(reqId) {
    return await prisma.requirement_history.findMany({
        where: { requirement_id: reqId },
        orderBy: { version: "desc" }
    });
}

export async function getHistoryById(historyId) {
    return await prisma.requirement_history.findUnique({
        where: { id: historyId }
    });
}

export async function findUserById(userId) {
    return await prisma.app_user.findUnique({
        where: { id: userId },
        select: { username: true, display_name: true }
    });
}

// ─── Comments ─────────────────────────────────────────────

export async function getCommentsByRequirementId(reqId) {
    return await prisma.requirement_comment.findMany({
        where: { requirement_id: reqId, parent_id: null },
        include: {
            author: { select: { username: true, display_name: true, profile_pic_url: true } },
            replies: {
                include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
            }
        },
        orderBy: { created_at: "asc" }
    });
}

export async function createCommentRecord(data) {
    return await prisma.requirement_comment.create({
        data,
        include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
    });
}

// ─── Traceability ─────────────────────────────────────────

export async function getTraceabilityLinks(reqId) {
    return await prisma.traceability_link.findMany({
        where: {
            OR: [
                { source_requirement_id: reqId },
                { target_requirement_id: reqId }
            ]
        }
    });
}

export async function findTraceabilityLink(reqId, targetId, linkType) {
    return await prisma.traceability_link.findFirst({
        where: {
            source_requirement_id: reqId,
            target_id: targetId,
            link_type: linkType
        }
    });
}

export async function createTraceabilityLinkRecord(data) {
    return await prisma.traceability_link.create({ data });
}

export async function findTraceabilityLinkById(linkId) {
    return await prisma.traceability_link.findUnique({
        where: { id: linkId }
    });
}

export async function deleteTraceabilityLinkRecord(linkId) {
    return await prisma.traceability_link.delete({
        where: { id: linkId }
    });
}

export async function getProjectTraceabilityGraph(projectId) {
    const requirements = await prisma.requirement.findMany({
        where: { project_id: projectId },
        select: {
            id: true,
            title: true,
            readable_id: true,
            status: true,
            parent_id: true,
            _count: {
                select: {
                    source_links: true,
                    target_links: true
                }
            }
        }
    });

    const traceabilityLinks = await prisma.traceability_link.findMany({
        where: {
            source_requirement: { project_id: projectId }
        }
    });

    const links = traceabilityLinks.map(l => ({
        id: l.id,
        source_id: l.source_requirement_id,
        target_id: l.target_id,
        link_type: l.link_type,
        category: 'dependency'
    }));

    requirements.forEach(req => {
        if (req.parent_id) {
            links.push({
                id: `hier-${req.id}`,
                source_id: req.parent_id,
                target_id: req.id,
                link_type: 'child',
                category: 'hierarchy'
            });
        }
    });

    return { nodes: requirements, links };
}

export async function findRequirementByTitle(projectId, title) {
    return await prisma.requirement.findFirst({
        where: { project_id: projectId, title }
    });
}

