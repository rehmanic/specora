import express from "express";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import {
    listDiagrams,
    createDiagram,
    getDiagram,
    updateDiagram,
    deleteDiagram,
    generateFromDescription,
    editDiagram,
} from "./diagramController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:projectId", listDiagrams);
router.post("/:projectId", createDiagram);
router.post("/:projectId/generate", generateFromDescription);
router.post("/:projectId/edit", editDiagram);
router.get("/:projectId/:diagramId", getDiagram);
router.put("/:projectId/:diagramId", updateDiagram);
router.delete("/:projectId/:diagramId", deleteDiagram);

export default router;
