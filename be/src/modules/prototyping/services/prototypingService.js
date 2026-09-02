import * as prototypingRepo from "../repositories/prototypingRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";

// ─── Prototype CRUD ───────────────────────────────────────

export async function getPrototypes(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await prototypingRepo.findPrototypesByProject(resolvedId);
}

export async function createPrototype(projectId, name, description) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    if (!name || !name.trim()) {
        throw new AppError("Prototype name is required", 400);
    }

    return await prototypingRepo.createPrototypeRecord({
        name: name.trim(),
        description: description || null,
        project_id: resolvedId,
        screens: {
            create: {
                name: "Home Screen",
                order: 0,
            },
        },
    });
}

export async function updatePrototype(prototypeId, data) {
    const { name, description } = data;

    try {
        return await prototypingRepo.updatePrototypeRecord(prototypeId, {
            ...(name !== undefined && { name: name.trim() }),
            ...(description !== undefined && { description }),
        });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Prototype not found", 404);
        throw err;
    }
}

export async function deletePrototype(prototypeId) {
    try {
        await prototypingRepo.deletePrototypeRecord(prototypeId);
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Prototype not found", 404);
        throw err;
    }
}

// ─── Screen CRUD ──────────────────────────────────────────

export async function getScreens(prototypeId) {
    return await prototypingRepo.findScreensByPrototype(prototypeId);
}

export async function createScreen(prototypeId, name) {
    if (!name || !name.trim()) {
        throw new AppError("Screen name is required", 400);
    }

    const maxOrder = await prototypingRepo.getMaxScreenOrder(prototypeId);
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    return await prototypingRepo.createScreenRecord({
        name: name.trim(),
        order: nextOrder,
        prototype_id: prototypeId,
        canvas_data: { elements: [] },
    });
}

export async function updateScreen(screenId, data) {
    const { name, order, canvas_data, thumbnail } = data;

    try {
        return await prototypingRepo.updateScreenRecord(screenId, {
            ...(name !== undefined && { name: name.trim() }),
            ...(order !== undefined && { order }),
            ...(canvas_data !== undefined && { canvas_data }),
            ...(thumbnail !== undefined && { thumbnail }),
        });
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Screen not found", 404);
        throw err;
    }
}

export async function deleteScreen(screenId) {
    try {
        await prototypingRepo.deleteScreenRecord(screenId);
    } catch (err) {
        if (err.code === "P2025") throw new AppError("Screen not found", 404);
        throw err;
    }
}

export async function reorderScreens(screenOrders) {
    if (!Array.isArray(screenOrders)) {
        throw new AppError("screenOrders array is required", 400);
    }

    await prototypingRepo.updateScreenOrdersTransaction(screenOrders);
}

// ─── Requirement Linking ──────────────────────────────────

export async function getScreenRequirements(screenId) {
    const links = await prototypingRepo.findScreenRequirements(screenId);
    return links.map((l) => l.requirement);
}

export async function updateScreenRequirements(screenId, requirementIds) {
    if (!Array.isArray(requirementIds)) {
        throw new AppError("requirement_ids array is required", 400);
    }

    await prototypingRepo.updateScreenRequirementsTransaction(screenId, requirementIds);

    return requirementIds.length;
}
