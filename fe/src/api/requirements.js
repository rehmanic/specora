import { api } from "./client";
import { REQUIREMENTS } from "./endpoints";

/**
 * Fetch all requirements for a project with optional filters
 * @param {string} projectId Target project id or slug
 * @param {Object} params { search, status, priority, category }
 */
export function getRequirements(projectId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = REQUIREMENTS.BY_PROJECT(projectId) + (query ? `?${query}` : "");
  return api.get(endpoint);
}

/**
 * Create a new requirement
 * @param {string} projectId Target project id or slug
 * @param {Object} data { title, description, priority, status, tags, category, attributes, parent_id, owner_id }
 */
export const createRequirement = (projectId, data) =>
  api.post(REQUIREMENTS.BY_PROJECT(projectId), data);

/**
 * Update a requirement
 * @param {string} projectId Target project id or slug
 * @param {string} requirementId ID of the requirement
 * @param {Object} data fields to update, including optional change_reason
 */
export const updateRequirement = (projectId, requirementId, data) =>
  api.put(REQUIREMENTS.SINGLE(projectId, requirementId), data);

/**
 * Delete a requirement
 * @param {string} projectId Target project id or slug
 * @param {string} requirementId ID of the requirement
 */
export const deleteRequirement = (projectId, requirementId) =>
  api.delete(REQUIREMENTS.SINGLE(projectId, requirementId));

/**
 * Get requirement change history
 */
export const getRequirementHistory = (projectId, requirementId) =>
  api.get(REQUIREMENTS.HISTORY(projectId, requirementId));

/**
 * Rollback requirement to a specific version
 */
export const rollbackRequirement = (projectId, requirementId, historyId) =>
  api.post(REQUIREMENTS.ROLLBACK(projectId, requirementId, historyId));

/**
 * Get comments for a requirement
 */
export const getRequirementComments = (projectId, requirementId) =>
  api.get(REQUIREMENTS.COMMENTS(projectId, requirementId));

/**
 * Add a comment to a requirement
 */
export const addRequirementComment = (projectId, requirementId, data) =>
  api.post(REQUIREMENTS.COMMENTS(projectId, requirementId), data);

/**
 * Get traceability links for a requirement
 */
export const getTraceabilityLinks = (projectId, requirementId) =>
  api.get(REQUIREMENTS.TRACEABILITY(projectId, requirementId));

export const createTraceabilityLink = (projectId, requirementId, data) =>
  api.post(REQUIREMENTS.TRACEABILITY(projectId, requirementId), data);

/**
 * Delete a traceability link
 */
export const deleteTraceabilityLink = (projectId, linkId) =>
  api.delete(REQUIREMENTS.TRACEABILITY_LINK(projectId, linkId));

/**
 * Get the project traceability graph
 */
export const getTraceabilityGraph = (projectId) =>
  api.get(REQUIREMENTS.TRACEABILITY_GRAPH(projectId));

/**
 * Import requirements from standard format
 * @param {string} projectId Target project id or slug
 * @param {Object} data { requirements: [...] }
 */
export const importRequirements = (projectId, data) =>
  api.post(REQUIREMENTS.IMPORT(projectId), data);
