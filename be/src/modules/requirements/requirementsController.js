import prisma from "../../../config/db/prismaClient.js";

const VALID_PRIORITIES = ['low', 'mid', 'high'];
const VALID_STATUSES = ['draft', 'pending', 'approved', 'rejected'];

// Helper to generate readable ID
// Parent: REQ-001, REQ-002, ...
// Child:  REQ-001.1, REQ-001.2, ...
const generateReadableId = async (projectId, parentId = null) => {
    if (parentId) {
        // Generate child ID based on parent's readable_id
        const parent = await prisma.requirement.findUnique({
            where: { id: parentId },
            select: { readable_id: true }
        });
        if (!parent) throw new Error('Parent requirement not found');

        const siblingCount = await prisma.requirement.count({
            where: { parent_id: parentId }
        });
        return `${parent.readable_id}.${siblingCount + 1}`;
    } else {
        // Generate root-level ID
        const rootCount = await prisma.requirement.count({
            where: { project_id: projectId, parent_id: null }
        });
        return `REQ-${String(rootCount + 1).padStart(3, '0')}`;
    }
};

// Helper to save history
const saveHistory = async (requirement, changedBy, reason) => {
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
};

// GET /api/requirements/:projectId
export const getProjectRequirements = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { search, status, priority, category } = req.query;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            resolvedId = project.id;
        }

        // Build filter
        const where = {
            project_id: resolvedId,
            parent_id: null // Only fetch root requirements for the main list
        };

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
                owner: {
                    select: { username: true, display_name: true }
                },
                _count: {
                    select: {
                        source_links: true, // Fan-out
                        target_links: true  // Fan-in
                    }
                }
            },
            orderBy: { created_at: "desc" },
        });

        res.status(200).json({
            message: "Requirements fetched successfully",
            count: requirements.length,
            requirements,
        });
    } catch (error) {
        console.error("Error fetching requirements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/requirements/:projectId
export const createRequirement = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, priority, status, tags, category, attributes, parent_id, owner_id } = req.body;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        const readableId = await generateReadableId(resolvedId, parent_id || null);

        const newRequirement = await prisma.requirement.create({
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
                owner_id: owner_id || req.user?.userId || req.user?.id,
            },
        });

        res.status(201).json({
            message: "Requirement created successfully",
            requirement: newRequirement,
        });
    } catch (error) {
        console.error("Error creating requirement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// PUT /api/requirements/:projectId/:requirementId
export const updateRequirement = async (req, res) => {
    try {
        const { requirementId } = req.params; console.log("ADD_COMMENT PARAMS:", req.params);
        const { title, description, priority, status, tags, category, attributes, parent_id, owner_id, change_reason } = req.body;

        const existing = await prisma.requirement.findUnique({
            where: { id: requirementId }
        });

        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        // Check if anything actually changed
        const hasChanges = (
            (title !== undefined && title !== existing.title) ||
            (description !== undefined && description !== existing.description) ||
            (priority !== undefined && priority !== existing.priority) ||
            (status !== undefined && status !== existing.status) ||
            (category !== undefined && category !== existing.category) ||
            (tags !== undefined && JSON.stringify(tags) !== JSON.stringify(existing.tags))
        );

        if (!hasChanges && !change_reason) {
            return res.status(200).json({
                message: "No changes detected",
                requirement: existing
            });
        }

        // Save history before update
        await saveHistory(existing, req.user?.userId || req.user?.id, change_reason);

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

        res.status(200).json({
            message: "Requirement updated successfully",
            requirement: updatedRequirement,
        });
    } catch (error) {
        console.error("Error updating requirement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// DELETE /api/requirements/:projectId/:requirementId
export const deleteRequirement = async (req, res) => {
    try {
        const { requirementId } = req.params; console.log("ADD_COMMENT PARAMS:", req.params);

        const existing = await prisma.requirement.findUnique({
            where: { id: requirementId }
        });

        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        // All related data (comments, history, dependencies, children) 
        // will be automatically deleted by DB Cascade as configured in schema.prisma
        await prisma.requirement.delete({
            where: { id: requirementId },
        });

        res.status(200).json({ message: "Requirement deleted successfully" });
    } catch (error) {
        console.error("Error deleting requirement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/requirements/:projectId/:requirementId/history
export const getRequirementHistory = async (req, res) => {
    try {
        const { requirementId } = req.params;
        const history = await prisma.requirement_history.findMany({
            where: { requirement_id: requirementId },
            orderBy: { version: "desc" }
        });

        // Manually join with app_user to get usernames
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

        res.status(200).json({ history: historyWithUsers });
    } catch (error) {
        console.error("Error fetching requirement history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/requirements/:projectId/:requirementId/rollback/:historyId
export const rollbackRequirement = async (req, res) => {
    try {
        const { requirementId, historyId } = req.params;

        const historyEntry = await prisma.requirement_history.findUnique({
            where: { id: historyId }
        });

        if (!historyEntry) return res.status(404).json({ message: "History entry not found" });

        const existing = await prisma.requirement.findUnique({ where: { id: requirementId } });
        await saveHistory(existing, req.user?.userId || req.user?.id, `Rollback to version ${historyEntry.version}`);

        const rolledBack = await prisma.requirement.update({
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

        res.status(200).json({ message: "Rollback successful", requirement: rolledBack });
    } catch (error) {
        console.error("Error rolling back requirement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Comments implementation
export const getComments = async (req, res) => {
    try {
        const { requirementId } = req.params; console.log("ADD_COMMENT PARAMS:", req.params);
        const comments = await prisma.requirement_comment.findMany({
            where: { requirement_id: requirementId, parent_id: null },
            include: {
                author: { select: { username: true, display_name: true, profile_pic_url: true } },
                replies: {
                    include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
                }
            },
            orderBy: { created_at: "asc" }
        });
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { requirementId } = req.params;
        const { content, parent_id } = req.body;

        const comment = await prisma.requirement_comment.create({
            data: {
                requirement_id: requirementId,
                author_id: req.user.userId || req.user.id,
                content,
                parent_id
            },
            include: { author: { select: { username: true, display_name: true, profile_pic_url: true } } }
        });

        res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Traceability implementation
export const getTraceabilityLinks = async (req, res) => {
    try {
        const { requirementId } = req.params; console.log("ADD_COMMENT PARAMS:", req.params);
        const links = await prisma.traceability_link.findMany({
            where: {
                OR: [
                    { source_requirement_id: requirementId },
                    { target_requirement_id: requirementId }
                ]
            }
        });
        res.status(200).json({ links });
    } catch (error) {
        console.error("Error fetching traceability links:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createTraceabilityLink = async (req, res) => {
    try {
        const { requirementId } = req.params;
        const { target_type, target_id, link_type } = req.body;

        // Check if link already exists
        const existingLink = await prisma.traceability_link.findFirst({
            where: {
                source_requirement_id: requirementId,
                target_requirement_id: target_type === 'requirement' ? target_id : undefined,
                target_id: target_type !== 'requirement' ? target_id : undefined,
                link_type
            }
        });

        if (existingLink) {
            return res.status(400).json({ message: "This dependency already exists" });
        }

        const data = {
            source_requirement_id: requirementId,
            target_type,
            target_id,
            link_type
        };

        if (target_type === 'requirement') {
            data.target_requirement_id = target_id;
        }

        const link = await prisma.traceability_link.create({ data });

        // Record history for the source requirement to mark dependency change
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
            await saveHistory(sourceReq, req.user?.userId || req.user?.id, `Added dependency: ${targetDisplayName}`);
        }

        res.status(201).json({ message: "Link created", link });
    } catch (error) {
        console.error("Error creating traceability link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTraceabilityLink = async (req, res) => {
    try {
        const { linkId } = req.params;

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
                await saveHistory(sourceReq, req.user?.userId || req.user?.id, `Removed dependency: ${targetDisplayName}`);
            }
        }

        await prisma.traceability_link.delete({
            where: { id: linkId }
        });
        res.status(200).json({ message: "Link deleted" });
    } catch (error) {
        console.error("Error deleting traceability link:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/requirements/:projectId/traceability/graph
export const getProjectTraceabilityGraph = async (req, res) => {
    try {
        const { projectId } = req.params;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

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

        // 1. Dependency/Traceability links
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

        // 2. Hierarchy links (Parent -> Child)
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

        res.status(200).json({ nodes: requirements, links });
    } catch (error) {
        console.error("Error fetching project graph:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/requirements/:projectId/import
export const importRequirements = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { requirements: importData } = req.body;

        if (!Array.isArray(importData) || importData.length === 0) {
            return res.status(400).json({ message: "Invalid import data. 'requirements' must be a non-empty array." });
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
        let resolvedId = projectId;
        if (!isUuid) {
            const project = await prisma.project.findFirst({
                where: { slug: projectId },
                select: { id: true },
            });
            if (!project) return res.status(404).json({ message: "Project not found" });
            resolvedId = project.id;
        }

        const errors = [];
        const created = [];

        // Recursive function to import a requirement and its children
        const importSingle = async (item, parentId = null, index) => {
            // Validate required fields
            if (!item.title || typeof item.title !== 'string' || item.title.trim().length === 0) {
                errors.push(`Item ${index + 1}: 'title' is required and must be a non-empty string.`);
                return;
            }
            if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
                errors.push(`Item ${index + 1} (${item.title}): 'description' is required and must be a non-empty string.`);
                return;
            }

            // Validate and normalize priority
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

            // Validate and normalize status
            let status = 'pending';
            if (item.status) {
                const normalizedStatus = item.status.toLowerCase();
                if (VALID_STATUSES.includes(normalizedStatus)) status = normalizedStatus;
                else {
                    errors.push(`Item ${index + 1} (${item.title}): Invalid status '${item.status}'. Must be one of: ${VALID_STATUSES.join(', ')}.`);
                    return;
                }
            }

            // Check for duplicate title within the same project
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
                    owner_id: req.user?.userId || req.user?.id,
                },
            });

            created.push(newReq);

            // Import children recursively
            if (Array.isArray(item.children) && item.children.length > 0) {
                for (let i = 0; i < item.children.length; i++) {
                    await importSingle(item.children[i], newReq.id, i);
                }
            }
        };

        for (let i = 0; i < importData.length; i++) {
            await importSingle(importData[i], null, i);
        }

        res.status(201).json({
            message: `Import completed. ${created.length} requirement(s) created.`,
            created_count: created.length,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Error importing requirements:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
