import { Router } from "express";
import * as controller from "./controller.js";

const router = Router();

router.post("/", controller.createFeedback);
router.get("/", controller.getAllFeedback);
router.get("/:id", controller.getFeedbackById);
router.put("/:id", controller.updateFeedback);
router.delete("/:id", controller.deleteFeedback);

export default router;
