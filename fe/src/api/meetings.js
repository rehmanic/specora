import { api } from "./client";
import { MEETINGS } from "./endpoints";

const AI_TIMEOUT = { timeout: 60_000 };

export const createMeeting = (data) =>
  api.post(MEETINGS.CREATE, data);

export const getProjectMeetings = (projectId) =>
  api.get(MEETINGS.BY_PROJECT(projectId));

export const getMeeting = (meetingId) =>
  api.get(MEETINGS.SINGLE(meetingId));

export const joinMeeting = (meetingId) =>
  api.post(MEETINGS.JOIN(meetingId));

export async function uploadRecording(meetingId, blob) {
  const formData = new FormData();
  formData.append("recording", blob, `recording-${Date.now()}.webm`);
  return api.upload(MEETINGS.UPLOAD_RECORDING(meetingId), formData);
}

export const updateMeeting = (meetingId, data) =>
  api.put(MEETINGS.SINGLE(meetingId), data);

export const transcribeMeeting = (meetingId) =>
  api.post(MEETINGS.TRANSCRIBE(meetingId), undefined, AI_TIMEOUT);

export const deleteMeeting = (meetingId) =>
  api.delete(MEETINGS.SINGLE(meetingId));

export const extractMeetingRequirements = (meetingId) =>
  api.post(MEETINGS.EXTRACT_REQUIREMENTS(meetingId), undefined, AI_TIMEOUT);
