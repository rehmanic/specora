import prisma from "../../../config/db/prismaClient.js";

// ─── Prototype CRUD ───────────────────────────────────────

export async function findPrototypesByProject(projectId) {
    return await prisma.prototype.findMany({
        where: { project_id: projectId },
        include: {
            screens: {
                select: { id: true, name: true, order: true, thumbnail: true },
                orderBy: { order: "asc" },
            },
        },
        orderBy: { created_at: "desc" },
    });
}

export async function createPrototypeRecord(data) {
    return await prisma.prototype.create({
        data,
        include: { screens: true },
    });
}

export async function updatePrototypeRecord(prototypeId, data) {
    return await prisma.prototype.update({
        where: { id: prototypeId },
        data: { ...data, updated_at: new Date() },
    });
}

export async function deletePrototypeRecord(prototypeId) {
    return await prisma.prototype.delete({ where: { id: prototypeId } });
}

// ─── Screen CRUD ──────────────────────────────────────────

export async function findScreensByPrototype(prototypeId) {
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

export async function getMaxScreenOrder(prototypeId) {
    return await prisma.prototype_screen.aggregate({
        where: { prototype_id: prototypeId },
        _max: { order: true },
    });
}

export async function createScreenRecord(data) {
    return await prisma.prototype_screen.create({ data });
}

export async function updateScreenRecord(screenId, data) {
    return await prisma.prototype_screen.update({
        where: { id: screenId },
        data: { ...data, updated_at: new Date() },
    });
}

export async function deleteScreenRecord(screenId) {
    return await prisma.prototype_screen.delete({ where: { id: screenId } });
}

export async function updateScreenOrdersTransaction(screenOrders) {
    return await prisma.$transaction(
        screenOrders.map(({ id, order }) =>
            prisma.prototype_screen.update({
                where: { id },
                data: { order, updated_at: new Date() },
            })
        )
    );
}

// ─── Requirement Linking ──────────────────────────────────

export async function findScreenRequirements(screenId) {
    return await prisma.screen_requirement.findMany({
        where: { screen_id: screenId },
        include: {
            requirement: { select: { id: true, title: true, description: true, priority: true, status: true } },
        },
    });
}

export async function updateScreenRequirementsTransaction(screenId, requirementIds) {
    return await prisma.$transaction([
        prisma.screen_requirement.deleteMany({ where: { screen_id: screenId } }),
        ...requirementIds.map((reqId) =>
            prisma.screen_requirement.create({
                data: { screen_id: screenId, requirement_id: reqId },
            })
        ),
    ]);
}
