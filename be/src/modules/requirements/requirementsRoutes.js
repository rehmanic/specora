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
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

router.use(verifyToken);

// Core CRUD
router.get("/:projectId", requirePermissions("view_requirements"), getProjectRequirements);
router.post("/:projectId", requirePermissions("create_requirement"), createRequirement);
router.post("/:projectId/import", requirePermissions("import_requirement"), importRequirements);
router.put("/:projectId/:requirementId", requirePermissions("update_requirement"), updateRequirement);
router.delete("/:projectId/:requirementId", requirePermissions("delete_requirement"), deleteRequirement);

// History & Rollback
router.get("/:projectId/:requirementId/history", requirePermissions("view_requirement_history"), getRequirementHistory);
router.post("/:projectId/:requirementId/rollback/:historyId", requirePermissions("rollback_requirement"), rollbackRequirement);

// Comments
router.get("/:projectId/:requirementId/comments", requirePermissions("view_requirement_comments"), getComments);
router.post("/:projectId/:requirementId/comments", requirePermissions("comment_on_requirements"), addComment);

// Traceability
router.get("/:projectId/:requirementId/traceability", requirePermissions("view_requirements"), getTraceabilityLinks);
router.post("/:projectId/:requirementId/traceability", requirePermissions("manage_requirement_dependencies"), createTraceabilityLink);
router.delete("/:projectId/traceability/:linkId", requirePermissions("manage_requirement_dependencies"), deleteTraceabilityLink);
router.get("/:projectId/traceability/graph", requirePermissions("view_requirement_graph"), getProjectTraceabilityGraph);

export default router;
