import { api } from "./client";
import { VERIFICATION } from "./endpoints";

const AI_TIMEOUT = { timeout: 60_000 };

/**
 * Run Specora ARM verification
 * @param {string} projectId Target project id
 */
export const runARMVerification = (projectId) =>
  api.post(VERIFICATION.ARM(projectId), undefined, AI_TIMEOUT);

/**
 * Run AI Verification
 * @param {string} projectId Target project id
 */
export const runAIVerification = (projectId) =>
  api.post(VERIFICATION.AI(projectId), undefined, AI_TIMEOUT);

/**
 * Run Specora ARM verification for a single requirement
 * @param {string} projectId Target project id
 * @param {string} requirementId Target requirement id
 */
export const runARMVerificationForRequirement = (projectId, requirementId) =>
  api.post(VERIFICATION.ARM_REQUIREMENT(projectId, requirementId), undefined, AI_TIMEOUT);

/**
 * Run AI Verification for a single requirement
 * @param {string} projectId Target project id
 * @param {string} requirementId Target requirement id
 */
export const runAIVerificationForRequirement = (projectId, requirementId) =>
  api.post(VERIFICATION.AI_REQUIREMENT(projectId, requirementId), undefined, AI_TIMEOUT);
