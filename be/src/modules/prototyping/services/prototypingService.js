import prisma from "../../../../config/db/prismaClient.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";

// ─── Prototype CRUD ───────────────────────────────────────

export async function getPrototypes(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await prisma.prototype.findMany({
        where: { project_id: resolvedId },
        include: {
            screens: {
                select: { id: true, name: true, order: true, thumbnail: true },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { created_at: "desc" },
    });
}

export async function createPrototype(projectId, name, description) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!name || !name.trim()) {
        throw new AppError("Prototype name is required", 400);
    }

    return await prisma.prototype.create({
        data: {
            name: name.trim(),
            description: description || null,
            project_id: resolvedId,
        },
        include: { screens: true },
    });
}

export async function updatePrototype(prototypeId, data) {
    const { name, description } = data;

    try {
        return await prisma.prototype.update({
            where: { id: prototypeId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(description !== undefined && { description }),
                updated_at: new Date(),
            },
        });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Prototype not found", 404);
        throw err;
    }
}

export async function deletePrototype(prototypeId) {
    try {
        await prisma.prototype.delete({ where: { id: prototypeId } });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Prototype not found", 404);
        throw err;
    }
}

// ─── Screen CRUD ──────────────────────────────────────────

export async function getScreens(prototypeId) {
    return await prisma.prototype_screen.findMany({
        where: { prototype_id: prototypeId },
        include: {
            requirement_links: {
                include: {
                    requirement: { select: { id: true, title: true, priority: true, status: true } },
                },
            },
        },
        orderBy: { order: "asc" },
    });
}

export async function createScreen(prototypeId, name) {
    if (!name || !name.trim()) {
        throw new AppError("Screen name is required", 400);
    }

    const maxOrder = await prisma.prototype_screen.aggregate({
        where: { prototype_id: prototypeId },
        _max: { order: true },
    });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return await prisma.prototype_screen.create({
        data: {
            name: name.trim(),
            order: nextOrder,
            prototype_id: prototypeId,
            canvas_data: { elements: [] },
        },
    });
}

export async function updateScreen(screenId, data) {
    const { name, order, canvas_data, thumbnail } = data;

    try {
        return await prisma.prototype_screen.update({
            where: { id: screenId },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(order !== undefined && { order }),
                ...(canvas_data !== undefined && { canvas_data }),
                ...(thumbnail !== undefined && { thumbnail }),
                updated_at: new Date(),
            },
        });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Screen not found", 404);
        throw err;
    }
}

export async function deleteScreen(screenId) {
    try {
        await prisma.prototype_screen.delete({ where: { id: screenId } });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Screen not found", 404);
        throw err;
    }
}

export async function reorderScreens(screenOrders) {
    if (!Array.isArray(screenOrders)) {
        throw new AppError("screenOrders array is required", 400);
    }

    await prisma.$transaction(
        screenOrders.map(({ id, order }) =>
            prisma.prototype_screen.update({
                where: { id },
                data: { order, updated_at: new Date() },
            })
        )
    );
}

// ─── Requirement Linking ──────────────────────────────────

export async function getScreenRequirements(screenId) {
    const links = await prisma.screen_requirement.findMany({
        where: { screen_id: screenId },
        include: {
            requirement: { select: { id: true, title: true, description: true, priority: true, status: true } },
        },
    });
    return links.map((l) => l.requirement);
}

export async function updateScreenRequirements(screenId, requirementIds) {
    if (!Array.isArray(requirementIds)) {
        throw new AppError("requirement_ids array is required", 400);
    }

    await prisma.$transaction([
        prisma.screen_requirement.deleteMany({ where: { screen_id: screenId } }),
        ...requirementIds.map((reqId) =>
            prisma.screen_requirement.create({
                data: { screen_id: screenId, requirement_id: reqId },
            })
        ),
    ]);

    return requirementIds.length;
}
