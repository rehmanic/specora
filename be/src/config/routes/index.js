import authRoutes from "../../modules/auth/routes/authRoutes.js";
import userRoutes from "../../modules/users/routes/userRoutes.js";
import projectRoutes from "../../modules/projects/routes/projectsRoutes.js";
import specbotRoutes from "../../modules/specbot/routes/specbotRoutes.js";
import chatRoutes from "../../modules/chat/routes/chatRoutes.js";
import uploadRoutes from "../../modules/upload/routes/uploadRoutes.js";
import feedbacksRoutes from "../../modules/feedbacks/routes/feedbacksRoutes.js";
import meetingsRoutes from "../../modules/meetings/routes/meetingsRoutes.js";
import requirementsRoutes from "../../modules/requirements/routes/requirementsRoutes.js";
import economicFeasibilityRoutes from "../../modules/economicFeasibility/routes/economicFeasibilityRoutes.js";
import techFeasibilityRoutes from "../../modules/technicalFeasibility/routes/techFeasibilityRoutes.js";
import legalFeasibilityRoutes from "../../modules/legalFeasibility/routes/legalFeasibilityRoutes.js";
import prototypingRoutes from "../../modules/prototyping/routes/prototypingRoutes.js";
import verificationRoutes from "../../modules/verification/routes/verificationRoutes.js";
import diagramRoutes from "../../modules/diagrams/routes/diagramRoutes.js";
import docRoutes from "../../modules/docs/routes/docRoutes.js";
import rbacRoutes from "../../modules/rbac/routes/rbacRoutes.js";

/**
 * Registers all API route modules on the Express application.
 * @param {import("express").Application} app Express application instance
 */
export function registerRoutes(app) {
  app.get("/", (req, res) => {
    res.json({ message: "root" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/specbot", specbotRoutes);
  app.use("/api/chat", chatRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/feedbacks", feedbacksRoutes);
  app.use("/api/meetings", meetingsRoutes);
  app.use("/api/requirements", requirementsRoutes);
  app.use("/api/economic-feasibility", economicFeasibilityRoutes);
  app.use("/api/tech-feasibility", techFeasibilityRoutes);
  app.use("/api/legal-feasibility", legalFeasibilityRoutes);
  app.use("/api/prototyping", prototypingRoutes);
  app.use("/api/verification", verificationRoutes);
  app.use("/api/diagrams", diagramRoutes);
  app.use("/api/docs/:projectId", docRoutes);
  app.use("/api/rbac", rbacRoutes);
}
