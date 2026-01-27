import useAuthStore from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ... (Existing exports) ...

// ======================
// Get Project Feedbacks
// ======================
export async function getProjectFeedbacks(projectId) {
    // ... (Same as before)
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/project/${projectId}`, {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to fetch feedbacks`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

export async function getFeedback(feedbackId) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to fetch feedback`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

export async function createFeedback(feedbackData) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(feedbackData),
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to create feedback`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

export async function updateFeedback(feedbackId, feedbackData) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(feedbackData),
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to update feedback`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

export async function submitResponse(feedbackId, response) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}/responses`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ response }),
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to submit response`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

export async function getResponses(feedbackId) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}/responses`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to fetch responses`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

// NEW ENDPOINTS

// ======================
// Delete Feedback
// ======================
export async function deleteFeedback(feedbackId) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        let data;
        // Handle 204 or check json (usually 200 with message)
        try { data = await res.json(); } catch (e) { /* ignore if empty */ }
        if (!res.ok) throw new Error(data?.message || `Failed to delete feedback`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

// ======================
// Delete Response
// ======================
export async function deleteResponse(responseId) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/responses/${responseId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        let data;
        try { data = await res.json(); } catch (e) { }
        if (!res.ok) throw new Error(data?.message || `Failed to delete response`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}

// ======================
// Get User Response (My Response)
// ======================
export async function getUserResponse(feedbackId) {
    try {
        const { token } = useAuthStore.getState();
        const res = await fetch(`${API_BASE}/feedbacks/${feedbackId}/my-response`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        let data;
        try { data = await res.json(); } catch (e) { throw new Error("Invalid server response"); }
        if (!res.ok) throw new Error(data?.message || `Failed to fetch your response`);
        return data;
    } catch (err) { throw new Error(err?.message || "Network error"); }
}
