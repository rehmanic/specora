import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ======================
// Create Specbot Chat
// ======================
export async function createSpecbotChat(chatData) {
    try {
        const { token } = useAuthStore.getState();

        const res = await fetch(`${API_BASE}/specbot/chat/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(chatData),
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to create chat${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}

// ======================
// Delete Specbot Chat
// ======================
export async function deleteSpecbotChat(chatId) {
    try {
        const { token } = useAuthStore.getState();

        const res = await fetch(`${API_BASE}/specbot/chat/delete/${chatId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to delete chat${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}

// ======================
// Get All Specbot Chats
// ======================
export async function getAllSpecbotChats(projectId) {
    try {
        const { token } = useAuthStore.getState();

        let url = `${API_BASE}/specbot/chat/all`;
        if (projectId) {
            url += `?projectId=${encodeURIComponent(projectId)}`;
        }

        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to fetch chats${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}

// ======================
// Update Specbot Chat
// ======================
export async function updateSpecbotChat(chatId, updateData) {
    try {
        const { token } = useAuthStore.getState();

        const res = await fetch(`${API_BASE}/specbot/chat/update/${chatId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to update chat${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}

// ======================
// Create Message
// ======================
export async function createMessage(messageData) {
    try {
        const { token } = useAuthStore.getState();

        const res = await fetch(`${API_BASE}/specbot/message/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(messageData),
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to send message${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}

// ======================
// Get All Messages
// ======================
export async function getAllMessages(chatId) {
    try {
        const { token } = useAuthStore.getState();

        const res = await fetch(`${API_BASE}/specbot/messages/all/${chatId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        let data;
        try {
            data = await res.json();
        } catch (parseError) {
            throw new Error(
                "Server response is invalid. Please try again later."
            );
        }

        if (!res.ok) {
            throw new Error(
                data?.message ||
                `Failed to fetch messages${res.status ? ` (${res.status})` : ""}`
            );
        }

        return data;
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        throw new Error(
            err?.message || "Network error. Please check your connection and try again."
        );
    }
}
