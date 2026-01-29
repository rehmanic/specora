import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (endpoint, options = {}) => {
    const { token } = useAuthStore.getState();
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
    }

    return res.json();
};

export const createMeeting = (data) =>
    fetchWithAuth("/meetings/create", { method: "POST", body: JSON.stringify(data) });

export const getProjectMeetings = (projectId) =>
    fetchWithAuth(`/meetings/project/${projectId}`);

export const getMeeting = (meetingId) =>
    fetchWithAuth(`/meetings/${meetingId}`);

export const joinMeeting = (meetingId) =>
    fetchWithAuth(`/meetings/${meetingId}/join`, { method: "POST" });

export const uploadRecording = async (meetingId, blob) => {
    const { token } = useAuthStore.getState();
    const formData = new FormData();
    formData.append('recording', blob, `recording-${Date.now()}.webm`);

    const res = await fetch(`${API_BASE}/meetings/${meetingId}/upload-recording`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
    }

    return res.json();
};

export const updateMeeting = (meetingId, data) =>
    fetchWithAuth(`/meetings/${meetingId}`, { method: "PUT", body: JSON.stringify(data) });

export const transcribeMeeting = (meetingId) =>
    fetchWithAuth(`/meetings/${meetingId}/transcribe`, { method: "POST" });

export const deleteMeeting = (meetingId) =>
    fetchWithAuth(`/meetings/${meetingId}`, { method: "DELETE" });
