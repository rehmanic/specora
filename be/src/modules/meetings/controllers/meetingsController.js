import asyncHandler from "../../../utils/asyncHandler.js";
import * as meetingsService from "../services/meetingsService.js";
export { meetingRecordingMiddleware as recordingUpload } from "../../../lib/storage/index.js";

// ─── Controller Methods ───────────────────────────────────

export const createMeeting = asyncHandler(async (req, res) => {
    // Ensure we parse the projectId properly from req.body (original logic expected project_id in body)
    const meeting = await meetingsService.createMeeting(req.body.project_id, req.body, req.user.id || req.user.userId);
    res.status(201).json(meeting);
});

export const getProjectMeetings = asyncHandler(async (req, res) => {
    const meetings = await meetingsService.getProjectMeetings(req.params.projectId);
    res.json(meetings);
});

export const getMeeting = asyncHandler(async (req, res) => {
    const meeting = await meetingsService.getMeeting(req.params.meetingId);
    res.json(meeting);
});

export const joinMeeting = asyncHandler(async (req, res) => {
    const token = await meetingsService.joinMeeting(req.params.meetingId, req.user);
    res.json({ token });
});

export const updateMeeting = asyncHandler(async (req, res) => {
    const updated = await meetingsService.updateMeeting(req.params.meetingId, req.body);
    res.json(updated);
});

export const transcribeMeeting = asyncHandler(async (req, res) => {
    const result = await meetingsService.transcribeMeeting(req.params.meetingId);
    if (result.status === "processing") {
        res.status(202).json(result);
    } else {
        res.json(result);
    }
});

export const deleteMeeting = asyncHandler(async (req, res) => {
    await meetingsService.deleteMeeting(req.params.meetingId);
    res.json({ message: "Meeting deleted" });
});

export const uploadRecording = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No recording file uploaded" });
    }
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const recordingUrl = await meetingsService.uploadRecording(req.params.meetingId, req.file.filename, baseUrl);
    
    res.json({
        message: "Recording uploaded successfully",
        filename: req.file.filename,
        url: recordingUrl,
        size: req.file.size
    });
});

export const webhookHandler = asyncHandler(async (req, res) => {
    await meetingsService.handleWebhook(req.body, req.headers['authorization']);
    res.status(200).send('ok');
});

export const extractMeetingRequirements = asyncHandler(async (req, res) => {
    const data = await meetingsService.extractMeetingRequirements(req.params.meetingId);
    res.status(200).json({
        message: "Requirements extracted successfully",
        data
    });
});
