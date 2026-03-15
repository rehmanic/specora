import express from "express";
import {
    createMeeting,
    getProjectMeetings,
    getMeeting,
    joinMeeting,
    updateMeeting,
    transcribeMeeting,
    deleteMeeting,
    webhookHandler,
    uploadRecording,
    recordingUpload,
    extractMeetingRequirements
} from "./meetingsController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";

const router = express.Router();

// Webhook must be public or validated differently (signature)
router.post("/webhook", express.raw({ type: 'application/webhook+json' }), webhookHandler);

router.use(verifyToken);

router.post("/create", createMeeting);
router.get("/project/:projectId", getProjectMeetings);
router.get("/:meetingId", getMeeting);
router.post("/:meetingId/join", joinMeeting);
router.put("/:meetingId", updateMeeting);
router.post("/:meetingId/transcribe", transcribeMeeting);
router.post("/:meetingId/extract-requirements", extractMeetingRequirements);
router.delete("/:meetingId", deleteMeeting);
router.post("/:meetingId/upload-recording", recordingUpload.single('recording'), uploadRecording);

export default router;
