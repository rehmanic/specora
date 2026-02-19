import prisma from "../../../config/db/prismaClient.js";
import { AccessToken, WebhookReceiver } from "livekit-server-sdk";
import { processTranscription } from "./transcriptionService.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure recordings directory exists
const recordingsDir = path.join(process.cwd(), "storage", "recordings");
if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
}

// Configure multer for recording uploads
const recordingStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, recordingsDir);
    },
    filename: (req, file, cb) => {
        const meetingId = req.params.meetingId;
        const timestamp = Date.now();
        const ext = path.extname(file.originalname) || '.webm';
        cb(null, `${meetingId}-${timestamp}${ext}`);
    },
});

export const recordingUpload = multer({
    storage: recordingStorage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit for recordings
    fileFilter: (req, file, cb) => {
        // Accept video/audio files
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('audio/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video/audio files are allowed'), false);
        }
    },
});

// Create a meeting
export const createMeeting = async (req, res) => {
    try {
        console.log("Create Meeting User:", req.user); // Debugging
        const { title, description, start_time, end_time, project_id, attendees } = req.body;
        const organizerId = req.user.id || req.user.userId; // Handle both cases

        let targetProjectId = project_id;

        // Check if projectId is a UUID using regex
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(project_id)) {
            // It's likely a slug
            const project = await prisma.project.findUnique({
                where: { slug: project_id },
                select: { id: true }
            });

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            targetProjectId = project.id;
        }

        // Create meeting in DB
        const meeting = await prisma.meeting.create({
            data: {
                title,
                description,
                start_time,
                end_time,
                project: {
                    connect: { id: targetProjectId }
                },
                organizer: {
                    connect: { id: organizerId }
                },
                attendees: {
                    create: attendees?.map((userId) => ({
                        user: { connect: { id: userId } },
                        role: "participant", // Default
                    })) || [],
                },
            },
            include: {
                attendees: true,
            },
        });

        // Add organizer as host
        await prisma.meeting_attendee.create({
            data: {
                meeting_id: meeting.id,
                user_id: organizerId,
                role: "host"
            }
        });

        res.status(201).json(meeting);
    } catch (error) {
        console.error("Create Meeting Error:", error);
        res.status(500).json({ message: "Failed to create meeting" });
    }
};

// Get meetings for a project
export const getProjectMeetings = async (req, res) => {
    try {
        const { projectId } = req.params;
        let targetProjectId = projectId;

        // Check if projectId is a UUID using regex
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!uuidRegex.test(projectId)) {
            // It's likely a slug
            const project = await prisma.project.findUnique({
                where: { slug: projectId },
                select: { id: true }
            });

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            targetProjectId = project.id;
        }

        const meetings = await prisma.meeting.findMany({
            where: { project_id: targetProjectId },
            include: {
                attendees: {
                    include: { user: { select: { id: true, display_name: true, profile_pic_url: true } } }
                },
                organizer: { select: { id: true, display_name: true } },
                transcripts: { select: { id: true, content: true } }
            },
            orderBy: { start_time: "asc" },
        });
        res.json(meetings);
    } catch (error) {
        console.error("Get Meetings Error:", error);
        res.status(500).json({ message: "Failed to fetch meetings" });
    }
};

// Get single meeting details
export const getMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                attendees: { include: { user: { select: { id: true, display_name: true } } } },
                transcripts: true
            }
        });

        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch meeting" });
    }
};

// Generate LiveKit Token
export const joinMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const user = req.user; // From verifyToken middleware

        // allow join if public or if user is part of project/attendee?
        // For now, allow logged in users who are project members.
        // Check if user has access to this meeting's project?
        // Simplified: Just generate token.

        const API_KEY = process.env.LIVEKIT_API_KEY;
        const API_SECRET = process.env.LIVEKIT_API_SECRET;

        if (!API_KEY || !API_SECRET) {
            return res.status(500).json({ message: "LiveKit not configured" });
        }

        const at = new AccessToken(API_KEY, API_SECRET, {
            identity: user.id || user.userId,
            name: user.display_name || user.username,
        });

        at.addGrant({ roomJoin: true, room: meetingId, canPublish: true, canSubscribe: true });

        const token = await at.toJwt();
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to generate token" });
    }
};


// Upload recording from client-side MediaRecorder
export const uploadRecording = async (req, res) => {
    try {
        const { meetingId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No recording file uploaded" });
        }

        // Construct URL for accessing the recording
        const recordingUrl = `${process.env.BASE_URL || "http://localhost:5000"}/recordings/${req.file.filename}`;

        // Try to update meeting with recording URL (optional - may fail if field doesn't exist)
        try {
            await prisma.meeting.update({
                where: { id: meetingId },
                data: { recording_url: recordingUrl }
            });
        } catch (dbError) {
            console.log("Note: Could not save recording URL to DB (recording_url field may not exist):", dbError.message);
        }

        console.log("Recording uploaded:", req.file.filename);

        res.json({
            message: "Recording uploaded successfully",
            filename: req.file.filename,
            url: recordingUrl,
            size: req.file.size
        });
    } catch (error) {
        console.error("Upload Recording Error:", error);
        res.status(500).json({ message: "Failed to upload recording", error: error.message });
    }
};

export const updateMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { title, description } = req.body;

        const updated = await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                title: title,
                description: description
            }
        });

        res.json(updated);
    } catch (error) {
        console.error("Update Meeting Error:", error);
        res.status(500).json({ message: "Failed to update meeting", error: error.message });
    }
};

// Generate transcript for a meeting recording
export const transcribeMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;

        // Get meeting with recording URL
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { transcripts: true }
        });

        if (!meeting) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        if (!meeting.recording_url) {
            return res.status(400).json({ message: "No recording available for this meeting" });
        }

        // Check if transcript already exists
        if (meeting.transcripts && meeting.transcripts.length > 0) {
            return res.json({
                message: "Transcript already exists",
                transcript: meeting.transcripts[0].content
            });
        }

        // Process transcription in background
        processTranscription(meetingId, meeting.recording_url).catch(err => {
            console.error("Background transcription failed:", err);
        });

        res.status(202).json({
            message: "Transcription started. Please check back later.",
            status: "processing"
        });
        return; // Return early

        // Fetch updated transcript (Legacy sync logic - removed)
        /*
        const updatedMeeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { transcripts: true }
        });

        const transcript = updatedMeeting.transcripts[0]?.content || "";

        res.json({
            message: "Transcript generated successfully",
            transcript
        });
        */
    } catch (error) {
        console.error("Transcribe Meeting Error:", error);
        res.status(500).json({ message: "Failed to generate transcript", error: error.message });
    }
};

export const deleteMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        await prisma.meeting.delete({ where: { id: meetingId } });
        res.json({ message: "Meeting deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete meeting" });
    }
}

export const webhookHandler = async (req, res) => {
    // Validate webhook
    const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);

    try {
        const event = await receiver.receive(req.body, req.headers['authorization']);

        console.log("LiveKit Webhook:", event.event);

        if (event.event === 'egress_ended' && event.egressInfo) {
            // Handle completed recording
            // Identify meeting ID (passed in egress metadata or room name?)
            const roomName = event.egressInfo.roomName;
            // Ideally map roomName (meetingId) to meeting
            const audioUrl = event.egressInfo.file.location;
            await processTranscription(roomName, audioUrl);
        }

        res.status(200).send('ok');
    } catch (error) {
        console.error("Webhook Error", error);
        res.status(401).send('invalid signature');
    }
}
