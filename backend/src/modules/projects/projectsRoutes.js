import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getSingleUserProjects,
} from "./projectsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import requireManager from "../../middlewares/common/roleCheck.js";
import checkUserExists from "../../middlewares/common/checkUserExists.js";
import checkProjectExists from "../../middlewares/projects/checkProjectExists.js";
import requireFeilds from "../../middlewares/common/requireFields.js";
import { validateProjectDataInput } from "../../middlewares/projects/inputValidation.js";

const router = express.Router();

router.use(verifyToken);

// CREATE - Manager only
router.post(
  "/create",
  requireManager,
  requireFeilds(["name", "start_date", "end_date"]),
  validateProjectDataInput,
  checkProjectExists("create"),
  createProject
);

// READ
router.get("/all", requireManager, getAllProjects); // Manager only - all projects
router.get("/:userId", getSingleUserProjects); // All authenticated users - their projects

// UPDATE - Manager only
router.put(
  "/update/:projectId",
  requireManager,
  requireFeilds(["name", "start_date", "end_date"]),
  validateProjectDataInput,
  checkProjectExists("update"),
  updateProject
);

// DELETE - Manager only
router.delete("/delete/:projectId", requireManager, deleteProject);

export default router;
