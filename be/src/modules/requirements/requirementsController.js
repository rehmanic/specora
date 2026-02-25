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
