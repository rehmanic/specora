import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
    const token = useAuthStore.getState().token;
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return {};

    return response.json();
};

export const getDiagrams = (projectId) =>
    request(`/diagrams/${projectId}`);

export const createDiagram = (projectId, body = {}) =>
    request(`/diagrams/${projectId}`, {
        method: "POST",
        body: JSON.stringify(body),
    });

export const getDiagram = (projectId, diagramId) =>
    request(`/diagrams/${projectId}/${diagramId}`);

export const updateDiagram = (projectId, diagramId, body) =>
    request(`/diagrams/${projectId}/${diagramId}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

export const deleteDiagram = (projectId, diagramId) =>
    request(`/diagrams/${projectId}/${diagramId}`, { method: "DELETE" });

export const generateDiagram = (projectId, { description }) =>
    request(`/diagrams/${projectId}/generate`, {
        method: "POST",
        body: JSON.stringify({ description }),
    });

export const editDiagram = (projectId, { current_mermaid_code, edit_instruction }) =>
    request(`/diagrams/${projectId}/edit`, {
        method: "POST",
        body: JSON.stringify({ current_mermaid_code, edit_instruction }),
    });
