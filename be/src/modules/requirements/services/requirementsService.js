import prisma from "../../../../config/db/prismaClient.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";

const VALID_PRIORITIES = ['low', 'mid', 'high'];
const VALID_STATUSES = ['draft', 'pending', 'approved', 'rejected'];

// ─── Helpers ──────────────────────────────────────────────

async function generateReadableId(projectId, parentId = null) {
    if (parentId) {
        const parent = await prisma.requirement.findUnique({
            where: { id: parentId },
            select: { readable_id: true }
        });
        if (!parent) throw new AppError('Parent requirement not found', 404);

        const children = await prisma.requirement.findMany({
            where: { parent_id: parentId },
            select: { readable_id: true }
        });

        let maxSuffix = 0;
        const prefix = `${parent.readable_id}.`;
        for (const child of children) {
            if (child.readable_id.startsWith(prefix)) {
                const suffixStr = child.readable_id.slice(prefix.length);
                const suffixNum = parseInt(suffixStr, 10);
                if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
                    maxSuffix = suffixNum;
                }
            }
        }
        return `${parent.readable_id}.${maxSuffix + 1}`;
    } else {
        const roots = await prisma.requirement.findMany({
            where: { project_id: projectId, parent_id: null },
            select: { readable_id: true }
        });
        
        let maxSuffix = 0;
        for (const root of roots) {
            const match = root.readable_id.match(/^REQ-(\d+)$/);
            if (match) {
                const suffixNum = parseInt(match[1], 10);
                if (!isNaN(suffixNum) && suffixNum > maxSuffix) {
                    maxSuffix = suffixNum;
                }
            }
        }
        return `REQ-${String(maxSuffix + 1).padStart(3, '0')}`;
    }
}

async function saveHistory(requirement, changedBy, reason) {
    const versionCount = await prisma.requirement_history.count({
        where: { requirement_id: requirement.id }
    });

    await prisma.requirement_history.create({
        data: {
            requirement_id: requirement.id,
            version: versionCount + 1,
            title: requirement.title,
            description: requirement.description,
            priority: requirement.priority,
            status: requirement.status,
            tags: requirement.tags,
            attributes: requirement.attributes,
            changed_by: changedBy,
            change_reason: reason || "Standard update",
        }
    });
}

// ─── Service Methods ──────────────────────────────────────

export async function getProjectRequirements(projectId, query) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { search, status, priority, category, flat } = query;

    const where = { project_id: resolvedId };

    if (flat !== "true") {
        where.parent_id = null;
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { readable_id: { contains: search, mode: 'insensitive' } },
        ];
    }

    const requirements = await prisma.requirement.findMany({
        where,
        include: {
            children: true,
            owner: { select: { username: true, display_name: true } },
            _count: {
                select: { source_links: true, target_links: true }
            }
        },
        orderBy: { created_at: "desc" },
    });

    return requirements;
}

export async function createRequirement(projectId, data, userId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, description, priority, status, tags, category, attributes, parent_id, owner_id } = data;
    const readableId = await generateReadableId(resolvedId, parent_id || null);

    return await prisma.requirement.create({
        data: {
            project_id: resolvedId,
            readable_id: readableId,
            title,
            description,
            priority: priority || "mid",
            status: status || "pending",
            tags: tags || [],
            category,
            attributes: attributes || {},
            parent_id: parent_id || null,
            owner_id: owner_id || userId,
        },
    });
}

export async function updateRequirement(requirementId, data, userId) {
    const { title, description, priority, status, tags, category, attributes, parent_id, owner_id, change_reason } = data;

    const existing = await prisma.requirement.findUnique({
        where: { id: requirementId }
    });

    if (!existing) throw new AppError("Requirement not found", 404);

    const hasChanges = (
        (title !== undefined && title !== existing.title) ||
        (description !== undefined && description !== existing.description) ||
        (priority !== undefined && priority !== existing.priority) ||
        (status !== undefined && status !== existing.status) ||
        (category !== undefined && category !== existing.category) ||
        (tags !== undefined && JSON.stringify(tags) !== JSON.stringify(existing.tags))
    );

    if (!hasChanges && !change_reason) {
        return { requirement: existing, no_changes: true };
    }

    await saveHistory(existing, userId, change_reason);

    const updatedRequirement = await prisma.requirement.update({
        where: { id: requirementId },
        data: {
            title: title !== undefined ? title : existing.title,
            description: description !== undefined ? description : existing.description,
            priority: priority !== undefined ? priority : existing.priority,
            status: status !== undefined ? status : existing.status,
            tags: tags !== undefined ? tags : existing.tags,
            category: category !== undefined ? category : existing.category,
            attributes: attributes !== undefined ? attributes : existing.attributes,
            parent_id: parent_id !== undefined ? parent_id : existing.parent_id,
            owner_id: owner_id !== undefined ? owner_id : existing.owner_id,
            updated_at: new Date(),
        },
    });

    return { requirement: updatedRequirement, no_changes: false };
}

export async function deleteRequirement(requirementId) {
    const existing = await prisma.requirement.findUnique({
        where: { id: requirementId }
    });

    if (!existing) throw new AppError("Requirement not found", 404);

    await prisma.requirement.delete({
        where: { id: requirementId },
    });
}

export async function getRequirementHistory(requirementId) {
    const history = await prisma.requirement_history.findMany({
        where: { requirement_id: requirementId },
        orderBy: { version: "desc" }
    });

    const historyWithUsers = await Promise.all(history.map(async (h) => {
        if (!h.changed_by) return { ...h, changer_username: "System" };
        const user = await prisma.app_user.findUnique({
            where: { id: h.changed_by },
            select: { username: true, display_name: true }
        });
        return {
            ...h,
            changer_username: user?.display_name || user?.username || "Unknown"
        };
    }));

    return historyWithUsers;
}

export async function rollbackRequirement(requirementId, historyId, userId) {
    const historyEntry = await prisma.requirement_history.findUnique({
        where: { id: historyId }
    });

    if (!historyEntry) throw new AppError("History entry not found", 404);

    const existing = await prisma.requirement.findUnique({ where: { id: requirementId } });
    if (!existing) throw new AppError("Requirement not found", 404);
    
    await saveHistory(existing, userId, `Rollback to version ${historyEntry.version}`);

    return await prisma.requirement.update({
        where: { id: requirementId },
        data: {
            title: historyEntry.title,
            description: historyEntry.description,
            priority: historyEntry.priority,
            status: historyEntry.status,
            tags: historyEntry.tags,
            attributes: historyEntry.attributes,
        }
    });
}

export async function getComments(requirementId) {
    return await prisma.requirement_comment.findMany({
        where: { requirement_id: requirementId, parent_id: null },
        include: {
            author: { select: { username: true, display_name: true, profile_pic_url: true } },
            replies: {
                include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
            }
        },
        orderBy: { created_at: "asc" }
    });
}

export async function addComment(requirementId, data, userId) {
    const { content, parent_id } = data;
    return await prisma.requirement_comment.create({
        data: {
            requirement_id: requirementId,
            author_id: userId,
            content,
            parent_id
        },
        include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
    });
}

export async function getTraceabilityLinks(requirementId) {
    return await prisma.traceability_link.findMany({
        where: {
            OR: [
                { source_requirement_id: requirementId },
                { target_requirement_id: requirementId }
            ]
        }
    });
}

export async function createTraceabilityLink(requirementId, data, userId) {
    const { target_type, target_id, link_type } = data;

    const existingLink = await prisma.traceability_link.findFirst({
        where: {
            source_requirement_id: requirementId,
            target_requirement_id: target_type === 'requirement' ? target_id : undefined,
            target_id: target_type !== 'requirement' ? target_id : undefined,
            link_type
        }
    });

    if (existingLink) {
        throw new AppError("This dependency already exists", 400);
    }

    const linkData = {
        source_requirement_id: requirementId,
        target_type,
        target_id,
        link_type
    };

    if (target_type === 'requirement') {
        linkData.target_requirement_id = target_id;
    }

    const link = await prisma.traceability_link.create({ data: linkData });

    const sourceReq = await prisma.requirement.findUnique({ where: { id: requirementId } });
    if (sourceReq) {
        let targetDisplayName = target_id;
        if (target_type === 'requirement') {
            const targetReq = await prisma.requirement.findUnique({
                where: { id: target_id },
                select: { readable_id: true }
            });
            if (targetReq?.readable_id) targetDisplayName = targetReq.readable_id;
        }
        await saveHistory(sourceReq, userId, `Added dependency: ${targetDisplayName}`);
    }

    return link;
}

export async function deleteTraceabilityLink(linkId, userId) {
    const link = await prisma.traceability_link.findUnique({
        where: { id: linkId }
    });

    if (link && link.source_requirement_id) {
        const sourceReq = await prisma.requirement.findUnique({ where: { id: link.source_requirement_id } });
        if (sourceReq) {
            let targetDisplayName = link.target_id;
            if (link.target_type === 'requirement' && link.target_requirement_id) {
                const targetReq = await prisma.requirement.findUnique({
                    where: { id: link.target_requirement_id },
                    select: { readable_id: true }
                });
                if (targetReq?.readable_id) targetDisplayName = targetReq.readable_id;
            }
            await saveHistory(sourceReq, userId, `Removed dependency: ${targetDisplayName}`);
        }
    }

    await prisma.traceability_link.delete({
        where: { id: linkId }
    });
}

export async function getProjectTraceabilityGraph(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const requirements = await prisma.requirement.findMany({
        where: { project_id: resolvedId },
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
            source_requirement: { project_id: resolvedId }
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

export async function importRequirements(projectId, importData, userId) {
    if (!Array.isArray(importData) || importData.length === 0) {
        throw new AppError("Invalid import data. 'requirements' must be a non-empty array.", 400);
    }

    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const errors = [];
    const created = [];

    const importSingle = async (item, parentId = null, index) => {
        if (!item.title || typeof item.title !== 'string' || item.title.trim().length === 0) {
            errors.push(`Item ${index + 1}: 'title' is required and must be a non-empty string.`);
            return;
        }
        if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
            errors.push(`Item ${index + 1} (${item.title}): 'description' is required and must be a non-empty string.`);
            return;
        }

        let priority = 'mid';
        if (item.priority) {
            const normalizedPriority = item.priority.toLowerCase();
            if (normalizedPriority === 'medium') priority = 'mid';
            else if (VALID_PRIORITIES.includes(normalizedPriority)) priority = normalizedPriority;
            else {
                errors.push(`Item ${index + 1} (${item.title}): Invalid priority '${item.priority}'. Must be one of: ${VALID_PRIORITIES.join(', ')}.`);
                return;
            }
        }

        let status = 'pending';
        if (item.status) {
            const normalizedStatus = item.status.toLowerCase();
            if (VALID_STATUSES.includes(normalizedStatus)) status = normalizedStatus;
            else {
                errors.push(`Item ${index + 1} (${item.title}): Invalid status '${item.status}'. Must be one of: ${VALID_STATUSES.join(', ')}.`);
                return;
            }
        }

        const existingByTitle = await prisma.requirement.findFirst({
            where: { project_id: resolvedId, title: item.title.trim() }
        });
        
        if (existingByTitle) {
            errors.push(`Item ${index + 1} (${item.title}): A requirement with this title already exists (${existingByTitle.readable_id}).`);
            return;
        }

        const readableId = await generateReadableId(resolvedId, parentId);

        const newReq = await prisma.requirement.create({
            data: {
                project_id: resolvedId,
                readable_id: readableId,
                title: item.title.trim(),
                description: item.description.trim(),
                priority,
                status,
                tags: Array.isArray(item.tags) ? item.tags : [],
                category: item.category || null,
                attributes: item.attributes || {},
                parent_id: parentId,
                owner_id: userId,
            },
        });

        created.push(newReq);

        if (Array.isArray(item.children) && item.children.length > 0) {
            for (let i = 0; i < item.children.length; i++) {
                await importSingle(item.children[i], newReq.id, i);
            }
        }
    };

    for (let i = 0; i < importData.length; i++) {
        await importSingle(importData[i], null, i);
    }

    return {
        created_count: created.length,
        errors: errors.length > 0 ? errors : undefined,
    };
}
