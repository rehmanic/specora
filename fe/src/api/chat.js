import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// Helper for authenticated requests
async function authFetch(endpoint, options = {}) {
    const { token } = useAuthStore.getState();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    let data;
    try {
        data = await res.json();
    } catch (e) {
        // If 204 or empty info
        data = {};
    }

    if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
    }

    return data;
}

export async function getProjectGroupChat(projectId) {
    try {
        return await authFetch(`/chat/project/${projectId}`);
    } catch (err) {
        throw err;
    }
}

export async function getGroupMessages(chatId) {
    try {
        return await authFetch(`/chat/${chatId}/messages`);
    } catch (err) {
        throw err;
    }
}

export async function deleteMessageRequest(messageId) {
    try {
        return await authFetch(`/chat/message/${messageId}`, {
            method: "DELETE",
        });
    } catch (err) {
        throw err;
    }
}
