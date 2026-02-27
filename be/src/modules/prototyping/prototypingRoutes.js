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

const router = express.Router();

router.use(verifyToken);

// Prototypes
router.get("/prototypes/:projectId", getPrototypes);
router.post("/prototypes/:projectId", createPrototype);
router.put("/prototypes/:prototypeId", updatePrototype);
router.delete("/prototypes/:prototypeId", deletePrototype);

// Screens
router.get("/prototypes/:prototypeId/screens", getScreens);
router.post("/prototypes/:prototypeId/screens", createScreen);
router.put("/screens/:screenId", updateScreen);
router.delete("/screens/:screenId", deleteScreen);
router.put("/screens/reorder", reorderScreens);

// Requirement linking
router.get("/screens/:screenId/requirements", getScreenRequirements);
router.put("/screens/:screenId/requirements", updateScreenRequirements);

export default router;
