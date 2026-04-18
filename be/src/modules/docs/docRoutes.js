import express from "express";
const router = express.Router({ mergeParams: true });
import * as docController from "./docController.js";
import { generateDoc, editDocWithAI } from "./docController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

router.use(verifyToken);

router
    .route("/")
    .get(requirePermissions("view_documents"), docController.getDocs)
    .post(requirePermissions("create_document"), docController.createDoc);

router
    .route("/:id")
    .get(requirePermissions("view_documents"), docController.getDocById)
    .put(requirePermissions("update_document"), docController.updateDoc)
    .delete(requirePermissions("delete_document"), docController.deleteDoc);

router.put("/:id/requirements", requirePermissions("update_document"), docController.updateDocRequirements);

// AI endpoints
router.post("/:id/generate", requirePermissions("update_document"), generateDoc);
router.post("/:id/edit-with-ai", requirePermissions("update_document"), editDocWithAI);

// Export endpoints
router.get("/:id/export/:format", requirePermissions("view_documents"), docController.exportDoc);

export default router;
