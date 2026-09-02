import { AccessToken, WebhookReceiver } from "livekit-server-sdk";
import * as meetingsRepo from "../repositories/meetingsRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";
import { processTranscription } from "./transcriptionService.js";
import { generateStatelessResponse } from "../../../utils/gemini.js";
import fs from "fs";
import path from "path";
import { storageService } from "../../../lib/storage/index.js";

// ─── Helpers ──────────────────────────────────────────────

const extractBulletPoints = (text) =>
    text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-") || line.startsWith("*"))
        .map((line) => line.replace(/^[-*]\s*/, ""))
        .filter(Boolean);

const mapBulletPointsToRequirements = (points) =>
    points.map((point, idx) => ({
        id: `req-${idx + 1}`,
        title: point.slice(0, 80),
        description: point,
        priority: "mid",
    }));

const stripMarkdownCodeBlock = (text) => {
    if (!text || typeof text !== "string") return text;
    let cleaned = text.trim();
    const codeBlockStart = /^```(?:\w+)?\s*\n?/;
    const codeBlockEnd = /\n?```\s*$/;

    if (codeBlockStart.test(cleaned) && codeBlockEnd.test(cleaned)) {
        cleaned = cleaned.replace(codeBlockStart, "").replace(codeBlockEnd, "");
        return cleaned.trim();
    }

    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
        return jsonBlockMatch[1].trim();
    }

    const jsonObjectMatch = cleaned.match(/(\{[\s\S]*\})/);
    if (jsonObjectMatch && jsonObjectMatch[1]) {
        try {
            JSON.parse(jsonObjectMatch[1]);
            return jsonObjectMatch[1];
        } catch { }
    }
    return cleaned.trim();
};

// ─── Meetings ─────────────────────────────────────────────

export async function createMeeting(projectId, data, userId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    const { title, description, start_time, end_time, attendees } = data;

    if (!title || title.trim() === "") {
        throw new AppError("Meeting title is required", 400);
    }

    return await meetingsRepo.createMeetingRecord({
        title: title.trim(),
        description,
        start_time: start_time ? new Date(start_time) : new Date(),
        end_time: end_time ? new Date(end_time) : null,
        project_id: resolvedId,
        organizer_id: userId,
        attendees: attendees || [],
    });
}

export async function getProjectMeetings(projectId) {
    const resolvedId = await resolveProjectId(projectId);
    if (!resolvedId) throw new AppError("Project not found", 404);

    return await meetingsRepo.findMeetingsByProject(resolvedId);
}

export async function getMeeting(meetingId) {
    const meeting = await meetingsRepo.findMeetingById(meetingId);

    if (!meeting) throw new AppError("Meeting not found", 404);
    return meeting;
}

export async function updateMeeting(meetingId, data) {
    const { title, description, start_time } = data;

    if (title !== undefined && title.trim() === "") {
        throw new AppError("Meeting title cannot be empty", 400);
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description;
    if (start_time) updateData.start_time = new Date(start_time);

    return await meetingsRepo.updateMeetingRecord(meetingId, updateData);
}

export async function deleteMeeting(meetingId) {
    await meetingsRepo.deleteMeetingRecord(meetingId);
}

// ─── LiveKit Token ────────────────────────────────────────

export async function joinMeeting(meetingId, user) {
    const API_KEY = process.env.LIVEKIT_API_KEY;
    const API_SECRET = process.env.LIVEKIT_API_SECRET;

    if (!API_KEY || !API_SECRET) {
        throw new AppError("LiveKit not configured", 500);
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
        identity: user.id || user.userId,
        name: user.display_name || user.username,
    });

    at.addGrant({ roomJoin: true, room: meetingId, canPublish: true, canSubscribe: true });

    return await at.toJwt();
}

// ─── Recording & Transcription ────────────────────────────

export async function uploadRecording(meetingId, filename, baseUrl) {
    const recordingUrl = `${baseUrl}/recordings/${filename}`;

    try {
        await meetingsRepo.updateMeetingRecord(meetingId, { recording_url: recordingUrl });
    } catch (dbError) {
        console.log("Note: Could not save recording URL to DB (recording_url field may not exist):", dbError.message);
    }

    return recordingUrl;
}

export async function transcribeMeeting(meetingId) {
    const meeting = await meetingsRepo.findMeetingById(meetingId);

    if (!meeting) {
        throw new AppError("Meeting not found", 404);
    }

    if (!meeting.recording_url) {
        throw new AppError("No recording available for this meeting", 400);
    }

    if (meeting.transcripts && meeting.transcripts.length > 0) {
        return {
            status: "completed",
            message: "Transcript already exists",
            transcript: meeting.transcripts[0].content
        };
    }

    processTranscription(meetingId, meeting.recording_url).catch(err => {
        console.error("Background transcription failed:", err);
    });

    return {
        status: "processing",
        message: "Transcription started. Please check back later."
    };
}

export async function handleWebhook(body, authHeader) {
    const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET);
    
    try {
        const event = await receiver.receive(body, authHeader);

        console.log("LiveKit Webhook:", event.event);

        if (event.event === 'egress_ended' && event.egressInfo) {
            const roomName = event.egressInfo.roomName;
            const audioUrl = event.egressInfo.file.location;
            await processTranscription(roomName, audioUrl);
        }
    } catch (error) {
        throw new AppError("invalid signature", 401);
    }
}

export async function extractMeetingRequirements(meetingId) {
    const meeting = await meetingsRepo.findMeetingById(meetingId);

    if (!meeting) {
        throw new AppError("Meeting not found", 404);
    }

    if (!meeting.transcripts || meeting.transcripts.length === 0) {
        throw new AppError("No transcript available for this meeting to extract requirements from.", 400);
    }

    const fullTranscript = meeting.transcripts.map(t => t.content).join("\n\n");

    if (!fullTranscript.trim()) {
        throw new AppError("Transcript is empty.", 400);
    }

    const instructions = {
        task: "extract_requirements",
        expectations:
            "Analyze the meeting transcript and extract distinct, actionable functional and non-functional requirements. Ignore chit-chat and off-topic discussion. Consolidate similar points into cohesive requirements.",
        output: 
            `You MUST return ONLY a valid JSON object matching this exact structure:
{
  "requirements": [
    {
      "title": "Short, concise summary (string)",
      "description": "Detailed explanation of the requirement (string)",
      "priority": "low, mid, or high (string, derive from context or default to mid)",
      "status": "draft",
      "tags": ["Array of context tags, e.g., UI, Database, Security, API", "string"]
    }
  ]
}
Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON string.`
    };

    const requirementsText = await generateStatelessResponse(
        fullTranscript,
        instructions
    );

    const requirementsPayload = {
        meeting_id: meetingId,
        project_id: meeting.project_id,
        generated_at: new Date().toISOString(),
        requirements: [],
        raw: requirementsText,
    };

    try {
        const cleanedText = stripMarkdownCodeBlock(requirementsText);
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed)) {
            requirementsPayload.requirements = parsed;
        } else if (Array.isArray(parsed.requirements)) {
            requirementsPayload.requirements = parsed.requirements;
        }
    } catch (parseError) {
        const points = extractBulletPoints(requirementsText);
        requirementsPayload.requirements = mapBulletPointsToRequirements(points);
    }

    const artifactPaths = {
        dir: path.join(storageService.getDomainPath("meetings"), "requirements"),
        file: path.join(storageService.getDomainPath("meetings"), "requirements", `${meetingId}-requirements.json`)
    };
    
    await fs.promises.mkdir(artifactPaths.dir, { recursive: true });

    await fs.promises.writeFile(
        artifactPaths.file,
        JSON.stringify(requirementsPayload, null, 2),
        "utf8"
    );

    return requirementsPayload.requirements;
}
