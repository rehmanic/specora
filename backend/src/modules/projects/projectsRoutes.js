import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getSingleUserProjects,
} from "./projectsController.js";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";

const router = express.Router();
router.use(verifyToken);

// Routes
router.post("/create", createProject);
router.get("/all", getAllProjects);
router.put("/update/:projectId", updateProject);
router.delete("/delete/:projectId", deleteProject);
router.get("/:userId", getSingleUserProjects);

export default router;
