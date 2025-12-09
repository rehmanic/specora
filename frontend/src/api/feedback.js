const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAllFeedback(token) {
    try {
        const res = await fetch(`${API_BASE}/feedback`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error("❌ Feedback API HTTP Error:");
            console.error("   Status:", res.status, res.statusText);
            console.error("   Details:", errData);
            throw new Error(errData.message || `HTTP ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();
        return result.data || result;
    } catch (error) {
        if (error.message.includes("fetch")) {
            console.error("❌ Feedback API Network Error:", error.message);
            throw new Error("Cannot connect to backend server.");
        }
        throw error;
    }
}

export async function createFeedback(data, token) {
    try {
        const res = await fetch(`${API_BASE}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to create feedback");
        }

        const result = await res.json();
        return result.data || result;
    } catch (error) {
        console.error("Create feedback error:", error);
        throw error;
    }
}
