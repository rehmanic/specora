import useAuthStore from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Helper ───────────────────────────────────────────────
async function request(url, options = {}) {
    const { token } = useAuthStore.getState();
    const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error("Server response is invalid.");
    }

    if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
    return data;
}

// ─── Prototypes ───────────────────────────────────────────

export const getPrototypes = (projectId) =>
    request(`/prototyping/prototypes/${projectId}`);

export const createPrototype = (projectId, body) =>
    request(`/prototyping/prototypes/${projectId}`, {
        method: "POST",
        body: JSON.stringify(body),
    });

export const updatePrototype = (prototypeId, body) =>
    request(`/prototyping/prototypes/${prototypeId}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

export const deletePrototype = (prototypeId) =>
    request(`/prototyping/prototypes/${prototypeId}`, { method: "DELETE" });

// ─── Screens ──────────────────────────────────────────────

export const getScreens = (prototypeId) =>
    request(`/prototyping/prototypes/${prototypeId}/screens`);

export const createScreen = (prototypeId, body) =>
    request(`/prototyping/prototypes/${prototypeId}/screens`, {
        method: "POST",
        body: JSON.stringify(body),
    });

export const updateScreen = (screenId, body) =>
    request(`/prototyping/screens/${screenId}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

export const deleteScreen = (screenId) =>
    request(`/prototyping/screens/${screenId}`, { method: "DELETE" });

export const reorderScreens = (screenOrders) =>
    request(`/prototyping/screens/reorder`, {
        method: "PUT",
        body: JSON.stringify({ screenOrders }),
    });

// ─── Requirement Linking ──────────────────────────────────

export const getScreenRequirements = (screenId) =>
    request(`/prototyping/screens/${screenId}/requirements`);

export const updateScreenRequirements = (screenId, requirement_ids) =>
    request(`/prototyping/screens/${screenId}/requirements`, {
        method: "PUT",
        body: JSON.stringify({ requirement_ids }),
    });
