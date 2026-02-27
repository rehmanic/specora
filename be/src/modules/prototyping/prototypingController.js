import prisma from "../../../config/db/prismaClient.js";

// ─── Helpers ──────────────────────────────────────────────

async function resolveProjectId(projectId) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    if (isUuid) return projectId;

    const project = await prisma.project.findFirst({
        where: { slug: projectId },
        select: { id: true },
    });
    return project?.id ?? null;
}

// ─── Prototype CRUD ───────────────────────────────────────

// GET /api/prototyping/prototypes/:projectId
export async function getPrototypes(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const prototypes = await prisma.prototype.findMany({
            where: { project_id: resolvedId },
            include: {
                screens: {
                    select: { id: true, name: true, order: true, thumbnail: true },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { created_at: "desc" },
        });

        res.json({ prototypes });
    } catch (err) {
        console.error("getPrototypes error:", err);
        res.status(500).json({ message: "Failed to fetch prototypes" });
    }
}

// POST /api/prototyping/prototypes/:projectId
export async function createPrototype(req, res) {
    try {
        const resolvedId = await resolveProjectId(req.params.projectId);
        if (!resolvedId) return res.status(404).json({ message: "Project not found" });

        const { name, description } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Prototype name is required" });
        }

        const prototype = await prisma.prototype.create({
            data: {
                name: name.trim(),
                description: description || null,
                project_id: resolvedId,
            },
            include: { screens: true },
        });

        res.status(201).json({ prototype });
    } catch (err) {
        console.error("createPrototype error:", err);
        res.status(500).json({ message: "Failed to create prototype" });
    }
}

// PUT /api/prototyping/prototypes/:prototypeId
export async function updatePrototype(req, res) {
    try {
        const { prototypeId } = req.params;
        const { name, description } = req.body;

        const prototype = await prisma.prototype.update({
            where: { id: prototypeId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(description !== undefined && { description }),
                updated_at: new Date(),
            },
        });

        res.json({ prototype });
    } catch (err) {
        console.error("updatePrototype error:", err);
        if (err.code === "P2025") return res.status(404).json({ message: "Prototype not found" });
        res.status(500).json({ message: "Failed to update prototype" });
    }
}

// DELETE /api/prototyping/prototypes/:prototypeId
export async function deletePrototype(req, res) {
    try {
        await prisma.prototype.delete({ where: { id: req.params.prototypeId } });
        res.json({ message: "Prototype deleted" });
    } catch (err) {
        console.error("deletePrototype error:", err);
        if (err.code === "P2025") return res.status(404).json({ message: "Prototype not found" });
        res.status(500).json({ message: "Failed to delete prototype" });
    }
}

// ─── Screen CRUD ──────────────────────────────────────────

// GET /api/prototyping/prototypes/:prototypeId/screens
export async function getScreens(req, res) {
    try {
        const screens = await prisma.prototype_screen.findMany({
            where: { prototype_id: req.params.prototypeId },
            include: {
                requirement_links: {
                    include: {
                        requirement: { select: { id: true, title: true, priority: true, status: true } },
                    },
                },
            },
            orderBy: { order: "asc" },
        });

        res.json({ screens });
    } catch (err) {
        console.error("getScreens error:", err);
        res.status(500).json({ message: "Failed to fetch screens" });
    }
}

// POST /api/prototyping/prototypes/:prototypeId/screens
export async function createScreen(req, res) {
    try {
        const { prototypeId } = req.params;
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Screen name is required" });
        }

        // Get next order value
        const maxOrder = await prisma.prototype_screen.aggregate({
            where: { prototype_id: prototypeId },
            _max: { order: true },
        });
        const nextOrder = (maxOrder._max.order ?? -1) + 1;

        const screen = await prisma.prototype_screen.create({
            data: {
                name: name.trim(),
                order: nextOrder,
                prototype_id: prototypeId,
                canvas_data: { elements: [] },
            },
        });

        res.status(201).json({ screen });
    } catch (err) {
        console.error("createScreen error:", err);
        res.status(500).json({ message: "Failed to create screen" });
    }
}

// PUT /api/prototyping/screens/:screenId
export async function updateScreen(req, res) {
    try {
        const { screenId } = req.params;
        const { name, order, canvas_data, thumbnail } = req.body;

        const screen = await prisma.prototype_screen.update({
            where: { id: screenId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(order !== undefined && { order }),
                ...(canvas_data !== undefined && { canvas_data }),
                ...(thumbnail !== undefined && { thumbnail }),
                updated_at: new Date(),
            },
        });

        res.json({ screen });
    } catch (err) {
        console.error("updateScreen error:", err);
        if (err.code === "P2025") return res.status(404).json({ message: "Screen not found" });
        res.status(500).json({ message: "Failed to update screen" });
    }
}

// DELETE /api/prototyping/screens/:screenId
export async function deleteScreen(req, res) {
    try {
        await prisma.prototype_screen.delete({ where: { id: req.params.screenId } });
        res.json({ message: "Screen deleted" });
    } catch (err) {
        console.error("deleteScreen error:", err);
        if (err.code === "P2025") return res.status(404).json({ message: "Screen not found" });
        res.status(500).json({ message: "Failed to delete screen" });
    }
}

// PUT /api/prototyping/screens/:screenId/reorder
export async function reorderScreens(req, res) {
    try {
        const { screenOrders } = req.body; // [{ id, order }, ...]

        if (!Array.isArray(screenOrders)) {
            return res.status(400).json({ message: "screenOrders array is required" });
        }

        await prisma.$transaction(
            screenOrders.map(({ id, order }) =>
                prisma.prototype_screen.update({
                    where: { id },
                    data: { order, updated_at: new Date() },
                })
            )
        );

        res.json({ message: "Screens reordered" });
    } catch (err) {
        console.error("reorderScreens error:", err);
        res.status(500).json({ message: "Failed to reorder screens" });
    }
}

// ─── Requirement Linking ──────────────────────────────────

// GET /api/prototyping/screens/:screenId/requirements
export async function getScreenRequirements(req, res) {
    try {
        const links = await prisma.screen_requirement.findMany({
            where: { screen_id: req.params.screenId },
            include: {
                requirement: { select: { id: true, title: true, description: true, priority: true, status: true } },
            },
        });

        res.json({ requirements: links.map((l) => l.requirement) });
    } catch (err) {
        console.error("getScreenRequirements error:", err);
        res.status(500).json({ message: "Failed to fetch screen requirements" });
    }
}

// PUT /api/prototyping/screens/:screenId/requirements
export async function updateScreenRequirements(req, res) {
    try {
        const { screenId } = req.params;
        const { requirement_ids } = req.body; // string[]

        if (!Array.isArray(requirement_ids)) {
            return res.status(400).json({ message: "requirement_ids array is required" });
        }

        // Delete all existing links, then create new ones
        await prisma.$transaction([
            prisma.screen_requirement.deleteMany({ where: { screen_id: screenId } }),
            ...requirement_ids.map((reqId) =>
                prisma.screen_requirement.create({
                    data: { screen_id: screenId, requirement_id: reqId },
                })
            ),
        ]);

        res.json({ message: "Requirements linked", count: requirement_ids.length });
    } catch (err) {
        console.error("updateScreenRequirements error:", err);
        res.status(500).json({ message: "Failed to update screen requirements" });
    }
}
