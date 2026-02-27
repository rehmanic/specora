import express from "express";
import {
    getProjectRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement
} from "./requirementsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// GET requirements for a project
router.get("/:projectId", getProjectRequirements);

// POST create requirement for a project
router.post("/:projectId", createRequirement);

// PUT update requirement
router.put("/:projectId/:requirementId", updateRequirement);

// DELETE requirement
router.delete("/:projectId/:requirementId", deleteRequirement);

export default router;
