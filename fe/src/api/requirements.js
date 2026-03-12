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
 * Fetch all requirements for a project with optional filters
 * @param {string} projectId Target project id or slug
 * @param {Object} params { search, status, priority, category }
 */
export const getRequirements = (projectId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/requirements/${projectId}${query ? `?${query}` : ""}`);
};

/**
 * Create a new requirement
 * @param {string} projectId Target project id or slug
 * @param {Object} data { title, description, priority, status, tags, category, attributes, parent_id, owner_id }
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
 * @param {Object} data fields to update, including optional change_reason
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

/**
 * Get requirement change history
 */
export const getRequirementHistory = (projectId, requirementId) => {
    return request(`/requirements/${projectId}/${requirementId}/history`);
};

/**
 * Rollback requirement to a specific version
 */
export const rollbackRequirement = (projectId, requirementId, historyId) => {
    return request(`/requirements/${projectId}/${requirementId}/rollback/${historyId}`, {
        method: "POST",
    });
};

/**
 * Get comments for a requirement
 */
export const getRequirementComments = (projectId, requirementId) => {
    return request(`/requirements/${projectId}/${requirementId}/comments`);
};

/**
 * Add a comment to a requirement
 */
export const addRequirementComment = (projectId, requirementId, data) => {
    return request(`/requirements/${projectId}/${requirementId}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Get traceability links for a requirement
 */
export const getTraceabilityLinks = (projectId, requirementId) => {
    return request(`/requirements/${projectId}/${requirementId}/traceability`);
};

export const createTraceabilityLink = (projectId, requirementId, data) => {
    return request(`/requirements/${projectId}/${requirementId}/traceability`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};

/**
 * Delete a traceability link
 */
export const deleteTraceabilityLink = (projectId, linkId) => {
    return request(`/requirements/${projectId}/traceability/${linkId}`, {
        method: "DELETE",
    });
};

/**
 * Get the project traceability graph
 */
export const getTraceabilityGraph = (projectId) => {
    return request(`/requirements/${projectId}/traceability/graph`);
};

/**
 * Import requirements from standard format
 * @param {string} projectId Target project id or slug
 * @param {Object} data { requirements: [...] }
 */
export const importRequirements = (projectId, data) => {
    return request(`/requirements/${projectId}/import`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};
