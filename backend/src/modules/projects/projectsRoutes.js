import express from "express";
import {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getSingleUserProjects,
} from "./projectsController.js";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";
import requireManager from "../../middlewares/roleCheck.js";
import checkProjectExists from "../../middlewares/projects/checkProjectExists.js";
import requireFeilds from "../../middlewares/common/requireFields.js";
import { validateProjectDataInput } from "../../middlewares/projects/inputValidation.js";

const router = express.Router();

router.use(verifyToken);
router.use(requireManager);

// CREATE
router.post(
  "/create",
  requireFeilds(["name", "start_date", "end_date"]),
  validateProjectDataInput,
  checkProjectExists("create"),
  createProject
);

// READ
router.get("/all", getAllProjects);
router.get("/:userId", getSingleUserProjects);

// UPDATE
router.put(
  "/update/:projectId",
  requireFeilds(["name", "start_date", "end_date"]),
  validateProjectDataInput,
  checkProjectExists("update"),
  updateProject
);

// DELETE
router.delete("/delete/:projectId", deleteProject);

export default router;
