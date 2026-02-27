import prisma from "../../../config/db/prismaClient.js";

// GET /api/requirements/:projectId
export const getProjectRequirements = async (req, res) => {
    try {
        const { projectId } = req.params;

        // projectId could be a UUID or a slug — resolve it
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

        const requirements = await prisma.requirement.findMany({
            where: { project_id: resolvedId },
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
        const { title, description, priority, status, tags } = req.body;

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

        const newRequirement = await prisma.requirement.create({
            data: {
                project_id: resolvedId,
                title,
                description,
                priority: priority || "mid",
                status: status || "draft",
                tags: tags || [],
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
        const { requirementId } = req.params;
        const { title, description, priority, status, tags } = req.body;

        // Check if exists
        const existing = await prisma.requirement.findUnique({
            where: { id: requirementId }
        });

        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        const updatedRequirement = await prisma.requirement.update({
            where: { id: requirementId },
            data: {
                title: title !== undefined ? title : existing.title,
                description: description !== undefined ? description : existing.description,
                priority: priority !== undefined ? priority : existing.priority,
                status: status !== undefined ? status : existing.status,
                tags: tags !== undefined ? tags : existing.tags,
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
        const { requirementId } = req.params;

        const existing = await prisma.requirement.findUnique({
            where: { id: requirementId }
        });

        if (!existing) {
            return res.status(404).json({ message: "Requirement not found" });
        }

        // We might need to handle related records first (screen_links, economic_estimate etc)
        // prisma handles NoAction for some relations, but for requirements, 
        // they usually cascade or need manual cleanup.
        // Let's delete the requirement, relying on DB constraints or cascading if defined.
        // If not cascading, we must clean up related data first.
        // Looking at schema: requirement has screen_links, economic_estimate. 
        // screen_requirement is onDelete: Cascade on the DB level implicitly usually, but let's just try delete first.
        // Wait, schema shows defaults, no explicit cascades. Let's delete related screen links first just in case.
        await prisma.screen_requirement.deleteMany({
            where: { requirement_id: requirementId }
        });

        await prisma.economic_estimate.deleteMany({
            where: { requirement_id: requirementId }
        });

        await prisma.requirement.delete({
            where: { id: requirementId },
        });

        res.status(200).json({ message: "Requirement deleted successfully" });
    } catch (error) {
        console.error("Error deleting requirement:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
