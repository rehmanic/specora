import prisma from "../../../config/db/prismaClient.js";

export async function findRequirementsByProject(projectId, options = {}) {
    return await prisma.requirement.findMany({
        where: { project_id: projectId },
        orderBy: options.orderBy || { created_at: "asc" },
    });
}

export async function findRequirementByIdAndProject(requirementId, projectId) {
    return await prisma.requirement.findFirst({
        where: { id: requirementId, project_id: projectId },
    });
}
