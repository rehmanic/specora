import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getSingleUserProjects,
} from "./projectsController.js";

const router = express.Router();

// Routes
router.post("/create", createProject);
router.get("/all", getAllProjects);
router.put("/update/:projectId", updateProject);
router.delete("/delete/:projectId", deleteProject);
router.get("/:userId", getSingleUserProjects);

export default router;
