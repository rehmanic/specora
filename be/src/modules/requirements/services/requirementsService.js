import * as requirementsRepo from "../repositories/requirementsRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";

const VALID_PRIORITIES = ['low', 'mid', 'high'];
const VALID_STATUSES = ['draft', 'pending', 'approved', 'rejected'];

// ─── Helpers ──────────────────────────────────────────────

async function generateReadableId(projectId, parentId = null) {
    if (parentId) {
        const parent = await requirementsRepo.findRequirementById(parentId);
        if (!parent) throw new AppError('Parent requirement not found', 404);

        const children = await requirementsRepo.findChildRequirements(parentId);

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
        const roots = await requirementsRepo.findRootRequirements(projectId);
        
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
    const versionCount = await requirementsRepo.countRequirementHistory(requirement.id);

    await requirementsRepo.createHistoryRecord({
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

    return await requirementsRepo.findRequirementsByProject(where);
}

export async function createRequirement(projectId, data, userId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, description, priority, status, tags, category, attributes, parent_id, owner_id } = data;
    const readableId = await generateReadableId(resolvedId, parent_id || null);

    return await requirementsRepo.createRequirementRecord({
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
    });
}

export async function updateRequirement(requirementId, data, userId) {
    const { title, description, priority, status, tags, category, attributes, parent_id, owner_id, change_reason } = data;

    const existing = await requirementsRepo.findRequirementById(requirementId);

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

    const updatedRequirement = await requirementsRepo.updateRequirementRecord(requirementId, {
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
    });

    return { requirement: updatedRequirement, no_changes: false };
}

export async function deleteRequirement(requirementId) {
    const existing = await requirementsRepo.findRequirementById(requirementId);

    if (!existing) throw new AppError("Requirement not found", 404);

    await requirementsRepo.deleteRequirementRecord(requirementId);
}

export async function getRequirementHistory(requirementId) {
    const history = await requirementsRepo.getHistoryByRequirementId(requirementId);

    const historyWithUsers = await Promise.all(history.map(async (h) => {
        if (!h.changed_by) return { ...h, changer_username: "System" };
        const user = await requirementsRepo.findUserById(h.changed_by);
        return {
            ...h,
            changer_username: user?.display_name || user?.username || "Unknown"
        };
    }));

    return historyWithUsers;
}

export async function rollbackRequirement(requirementId, historyId, userId) {
    const historyEntry = await requirementsRepo.getHistoryById(historyId);

    if (!historyEntry) throw new AppError("History entry not found", 404);

    const existing = await requirementsRepo.findRequirementById(requirementId);
    if (!existing) throw new AppError("Requirement not found", 404);
    
    await saveHistory(existing, userId, `Rollback to version ${historyEntry.version}`);

    return await requirementsRepo.updateRequirementRecord(requirementId, {
        title: historyEntry.title,
        description: historyEntry.description,
        priority: historyEntry.priority,
        status: historyEntry.status,
        tags: historyEntry.tags,
        attributes: historyEntry.attributes,
    });
}

export async function getComments(requirementId) {
    return await requirementsRepo.getCommentsByRequirementId(requirementId);
}

export async function addComment(requirementId, data, userId) {
    const { content, parent_id } = data;
    return await requirementsRepo.createCommentRecord({
        requirement_id: requirementId,
        author_id: userId,
        content,
        parent_id
    });
}

export async function getTraceabilityLinks(requirementId) {
    return await requirementsRepo.getTraceabilityLinks(requirementId);
}

export async function createTraceabilityLink(requirementId, data, userId) {
    const { target_type, target_id, link_type } = data;

    const existingLink = await requirementsRepo.findTraceabilityLink(requirementId, target_id, link_type);

    if (existingLink) {
        throw new AppError("This dependency already exists", 400);
    }

    const link = await requirementsRepo.createTraceabilityLinkRecord({
        source_requirement_id: requirementId,
        target_type,
        target_id,
        link_type
    });

    const sourceReq = await requirementsRepo.findRequirementById(requirementId);
    if (sourceReq) {
        let targetDisplayName = target_id;
        if (target_type === 'requirement') {
            const targetReq = await requirementsRepo.findRequirementById(target_id);
            if (targetReq?.readable_id) targetDisplayName = targetReq.readable_id;
        }
        await saveHistory(sourceReq, userId, `Added dependency: ${targetDisplayName}`);
    }

    return link;
}

export async function deleteTraceabilityLink(linkId, userId) {
    const link = await requirementsRepo.findTraceabilityLinkById(linkId);

    if (link && link.source_requirement_id) {
        const sourceReq = await requirementsRepo.findRequirementById(link.source_requirement_id);
        if (sourceReq) {
            let targetDisplayName = link.target_id;
            if (link.target_type === 'requirement' && link.target_requirement_id) {
                const targetReq = await requirementsRepo.findRequirementById(link.target_requirement_id);
                if (targetReq?.readable_id) targetDisplayName = targetReq.readable_id;
            }
            await saveHistory(sourceReq, userId, `Removed dependency: ${targetDisplayName}`);
        }
    }

    await requirementsRepo.deleteTraceabilityLinkRecord(linkId);
}

export async function getProjectTraceabilityGraph(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await requirementsRepo.getProjectTraceabilityGraph(resolvedId);
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

        const existingByTitle = await requirementsRepo.findRequirementByTitle(resolvedId, item.title.trim());
        
        if (existingByTitle) {
            errors.push(`Item ${index + 1} (${item.title}): A requirement with this title already exists (${existingByTitle.readable_id}).`);
            return;
        }

        const readableId = await generateReadableId(resolvedId, parentId);

        const newReq = await requirementsRepo.createRequirementRecord({
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
