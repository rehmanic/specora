import express from "express";
import { getProjectRequirements } from "./requirementsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// GET requirements for a project
router.get("/:projectId", getProjectRequirements);

export default router;
