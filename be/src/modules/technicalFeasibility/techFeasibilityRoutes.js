import express from "express";
import { search } from "./techFeasibilityController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

// Search
router.post("/search/:projectId", search);

export default router;
