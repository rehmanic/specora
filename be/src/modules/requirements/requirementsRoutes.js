import express from "express";
import {
    getProjectRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    getRequirementHistory,
    rollbackRequirement,
    getComments,
    addComment,
    getTraceabilityLinks,
    createTraceabilityLink,
    deleteTraceabilityLink,
    getProjectTraceabilityGraph,
    importRequirements
} from "./requirementsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// Core CRUD
router.get("/:projectId", getProjectRequirements);
router.post("/:projectId", createRequirement);
router.post("/:projectId/import", importRequirements);
router.put("/:projectId/:requirementId", updateRequirement);
router.delete("/:projectId/:requirementId", deleteRequirement);

// History & Rollback
router.get("/:projectId/:requirementId/history", getRequirementHistory);
router.post("/:projectId/:requirementId/rollback/:historyId", rollbackRequirement);

// Comments
router.get("/:projectId/:requirementId/comments", getComments);
router.post("/:projectId/:requirementId/comments", addComment);

// Traceability
router.get("/:projectId/:requirementId/traceability", getTraceabilityLinks);
router.post("/:projectId/:requirementId/traceability", createTraceabilityLink);
router.delete("/:projectId/traceability/:linkId", deleteTraceabilityLink);
router.get("/:projectId/traceability/graph", getProjectTraceabilityGraph);

export default router;
