import prisma from "../../../../config/db/prismaClient.js";

/**
 * Fetch requirements for a project (limited, for context).
 */
export async function findRequirementsByProject(projectId, { select, take } = {}) {
    return await prisma.requirement.findMany({
        where: { project_id: projectId },
        select: select || undefined,
        take: take || undefined,
    });
}
