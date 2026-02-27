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

    // Return empty object for 204 No Content
    if (response.status === 204) return {};

    return response.json();
};

/**
 * Fetch all requirements for a project
 * @param {string} projectId Target project id or slug
 */
export const getRequirements = (projectId) => {
    return request(`/requirements/${projectId}`);
};

/**
 * Create a new requirement
 * @param {string} projectId Target project id or slug
 * @param {Object} data { title, description, priority, status, tags }
 */
export const createRequirement = (projectId, data) => {
    return request(`/requirements/${projectId}`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Update a requirement
 * @param {string} projectId Target project id or slug
 * @param {string} requirementId ID of the requirement
 * @param {Object} data fields to update
 */
export const updateRequirement = (projectId, requirementId, data) => {
    return request(`/requirements/${projectId}/${requirementId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
};

/**
 * Delete a requirement
 * @param {string} projectId Target project id or slug
 * @param {string} requirementId ID of the requirement
 */
export const deleteRequirement = (projectId, requirementId) => {
    return request(`/requirements/${projectId}/${requirementId}`, {
        method: "DELETE",
    });
};
