import express from "express";
import {
    getPrototypes,
    createPrototype,
    updatePrototype,
    deletePrototype,
    getScreens,
    createScreen,
    updateScreen,
    deleteScreen,
    reorderScreens,
    getScreenRequirements,
    updateScreenRequirements,
} from "./prototypingController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

router.use(verifyToken);

// Prototypes
router.get("/prototypes/:projectId", requirePermissions("view_prototypes"), getPrototypes);
router.post("/prototypes/:projectId", requirePermissions("create_prototype"), createPrototype);
router.put("/prototypes/:prototypeId", requirePermissions("update_prototype"), updatePrototype);
router.delete("/prototypes/:prototypeId", requirePermissions("delete_prototype"), deletePrototype);

// Screens
router.get("/prototypes/:prototypeId/screens", requirePermissions("view_prototypes"), getScreens);
router.post("/prototypes/:prototypeId/screens", requirePermissions("manage_prototype_screens"), createScreen);
router.put("/screens/:screenId", requirePermissions("manage_prototype_screens"), updateScreen);
router.delete("/screens/:screenId", requirePermissions("manage_prototype_screens"), deleteScreen);
router.put("/screens/reorder", requirePermissions("manage_prototype_screens"), reorderScreens);

// Requirement linking
router.get("/screens/:screenId/requirements", requirePermissions("link_requirements_to_screens"), getScreenRequirements);
router.put("/screens/:screenId/requirements", requirePermissions("link_requirements_to_screens"), updateScreenRequirements);

export default router;
