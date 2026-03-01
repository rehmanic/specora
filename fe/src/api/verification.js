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

/**
 * Run Specora ARM verification
 * @param {string} projectId Target project id
 */
export const runARMVerification = (projectId) => {
    return request(`/verification/arm/${projectId}`, {
        method: "POST",
    });
};

/**
 * Run AI Verification
 * @param {string} projectId Target project id
 */
export const runAIVerification = (projectId) => {
    return request(`/verification/ai/${projectId}`, {
        method: "POST",
    });
};

/**
 * Run Specora ARM verification for a single requirement
 * @param {string} projectId Target project id
 * @param {string} requirementId Target requirement id
 */
export const runARMVerificationForRequirement = (projectId, requirementId) => {
    return request(`/verification/arm/${projectId}/requirement/${requirementId}`, {
        method: "POST",
    });
};

/**
 * Run AI Verification for a single requirement
 * @param {string} projectId Target project id
 * @param {string} requirementId Target requirement id
 */
export const runAIVerificationForRequirement = (projectId, requirementId) => {
    return request(`/verification/ai/${projectId}/requirement/${requirementId}`, {
        method: "POST",
    });
};
