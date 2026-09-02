import express from "express";
import { upload, uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// Route: POST /api/upload
// Description: Upload a single file
router.post("/", upload.single("file"), uploadFile);

export default router;
