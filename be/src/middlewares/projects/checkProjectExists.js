import prisma from "../../../config/db/prismaClient.js";

export default function checkProjectExists(action) {
  return async (req, res, next) => {
    try {
      const { name } = req.body;
      const { projectId } = req.params;
      let project;

      if (action === "create") {
        project = await prisma.project.findUnique({ where: { name } });
        if (project) {
          return res.status(409).json({ message: "Project already exists" });
        }
      } else if (action === "update") {
        project = await prisma.project.findUnique({
          where: { id: projectId },
        });
        if (!project) {
          return res.status(401).json({ message: "Project doesn't exist" });
        }
      }

      next();
    } catch (error) {
      console.error("Check project exists error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
