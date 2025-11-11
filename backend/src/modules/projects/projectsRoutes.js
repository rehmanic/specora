import express from "express";
import { body, param, query } from "express-validator";
import { createProject, getAllProjects, getProjectById, getProjectBySlug, 
  updateProject, deleteProject, searchProjects, addMember, removeMember, getSingleUserProjects } from "./projectsController.js";

const router = express.Router();

const createValidation = [
  body("name").trim().notEmpty().withMessage("Project name is required").isLength({ max: 255 }).withMessage("Name too long"),
  body("slug").trim().notEmpty().withMessage("Project slug is required").isLength({ max: 255 }).withMessage("Slug too long"),
];

const updateValidation = [
  param("id").notEmpty().withMessage("Project id is required"),
];

// Routes
router.get("/all", getAllProjects);
router.get("/search", searchProjects);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);

router.post("/create", createValidation, createProject);
router.put("/:id", updateValidation, updateProject);
router.delete("/:id", deleteProject);
router.get("/:username", getSingleUserProjects);

// members
router.post("/:id/members", addMember);
router.delete("/:id/members", removeMember);

export default router;
