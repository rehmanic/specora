import prisma from "../../../config/db/prismaClient.js";

// ─── Config ───────────────────────────────────────────────

export async function findConfigByProject(projectId) {
    return await prisma.economic_config.findUnique({
        where: { project_id: projectId },
    });
}

export async function upsertConfig(projectId, data) {
    return await prisma.economic_config.upsert({
        where: { project_id: projectId },
        update: { ...data, updated_at: new Date() },
        create: { project_id: projectId, ...data },
    });
}

// ─── Estimates ────────────────────────────────────────────

export async function findEstimatesByProject(projectId, options = {}) {
    return await prisma.economic_estimate.findMany({
        where: { requirement: { project_id: projectId } },
        include: options.include || undefined,
        orderBy: options.orderBy || undefined,
    });
}

export async function upsertEstimatesTransaction(estimates) {
    return await prisma.$transaction(
        estimates.map((est) =>
            prisma.economic_estimate.upsert({
                where: { requirement_id: est.requirement_id },
                update: {
                    optimistic_hours: est.optimistic_hours,
                    most_likely_hours: est.most_likely_hours,
                    pessimistic_hours: est.pessimistic_hours,
                    updated_at: new Date(),
                },
                create: {
                    requirement_id: est.requirement_id,
                    optimistic_hours: est.optimistic_hours,
                    most_likely_hours: est.most_likely_hours,
                    pessimistic_hours: est.pessimistic_hours,
                },
            })
        )
    );
}
