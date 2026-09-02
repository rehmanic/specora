import prisma from "../../../config/db/prismaClient.js";

// ─── Meeting CRUD ─────────────────────────────────────────

export async function findMeetingById(meetingId) {
    return await prisma.meeting.findUnique({
        where: { id: meetingId },
        include: { transcripts: true }
    });
}

export async function findMeetingsByProject(projectId) {
    return await prisma.meeting.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: "desc" },
    });
}

export async function createMeetingRecord(data) {
    return await prisma.meeting.create({ data });
}

export async function updateMeetingRecord(meetingId, data) {
    return await prisma.meeting.update({
        where: { id: meetingId },
        data: { ...data, updated_at: new Date() },
    });
}

export async function deleteMeetingRecord(meetingId) {
    return await prisma.meeting.delete({
        where: { id: meetingId },
    });
}

export async function findMeetingByRoomName(roomName) {
    return await prisma.meeting.findUnique({
        where: { room_name: roomName }
    });
}

// ─── Transcripts ──────────────────────────────────────────

export async function findTranscriptByMeetingId(meetingId) {
    return await prisma.meeting_transcript.findFirst({
        where: { meeting_id: meetingId }
    });
}

export async function createTranscriptRecord(data) {
    return await prisma.meeting_transcript.create({ data });
}

export async function updateTranscriptRecord(transcriptId, data) {
    return await prisma.meeting_transcript.update({
        where: { id: transcriptId },
        data
    });
}

