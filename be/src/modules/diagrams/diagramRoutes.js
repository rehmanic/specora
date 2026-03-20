import express from "express";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";
import {
    listDiagrams,
    createDiagram,
    getDiagram,
    updateDiagram,
    deleteDiagram,
    generateFromDescription,
    editDiagram,
    updateDiagramRequirements,
} from "./diagramController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:projectId", requirePermissions("view_diagrams"), listDiagrams);
router.post("/:projectId", requirePermissions("create_diagram"), createDiagram);
router.post("/:projectId/generate", requirePermissions("create_diagram"), generateFromDescription);
router.post("/:projectId/edit", requirePermissions("update_diagram"), editDiagram);
router.get("/:projectId/:diagramId", requirePermissions("view_diagrams"), getDiagram);
router.put("/:projectId/:diagramId", requirePermissions("update_diagram"), updateDiagram);
router.put("/:projectId/:diagramId/requirements", requirePermissions("update_diagram"), updateDiagramRequirements);
router.delete("/:projectId/:diagramId", requirePermissions("delete_diagram"), deleteDiagram);

export default router;
