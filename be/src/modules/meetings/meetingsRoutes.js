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
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";

const router = express.Router();

// Webhook must be public (validated by signature)
router.post("/webhook", express.raw({ type: 'application/webhook+json' }), webhookHandler);

router.use(verifyToken);

router.post("/create", requirePermissions("create_meeting"), createMeeting);
router.get("/project/:projectId", requirePermissions("join_meeting"), getProjectMeetings);
router.get("/:meetingId", requirePermissions("join_meeting"), getMeeting);
router.post("/:meetingId/join", requirePermissions("join_meeting"), joinMeeting);
router.put("/:meetingId", requirePermissions("update_meeting"), updateMeeting);
router.post("/:meetingId/transcribe", requirePermissions("generate_meeting_transcript"), transcribeMeeting);
router.post("/:meetingId/extract-requirements", requirePermissions("generate_meeting_transcript"), extractMeetingRequirements);
router.delete("/:meetingId", requirePermissions("delete_meeting"), deleteMeeting);
router.post("/:meetingId/upload-recording", requirePermissions("record_meeting"), recordingUpload.single('recording'), uploadRecording);

export default router;
