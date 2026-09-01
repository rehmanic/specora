import { api } from "./client";
import { DIAGRAMS } from "./endpoints";

const AI_TIMEOUT = { timeout: 60_000 };

export const getDiagrams = (projectId) =>
  api.get(DIAGRAMS.BY_PROJECT(projectId));

export const createDiagram = (projectId, body = {}) =>
  api.post(DIAGRAMS.BY_PROJECT(projectId), body);

export const getDiagram = (projectId, diagramId) =>
  api.get(DIAGRAMS.SINGLE(projectId, diagramId));

export const updateDiagram = (projectId, diagramId, body) =>
  api.put(DIAGRAMS.SINGLE(projectId, diagramId), body);

export const deleteDiagram = (projectId, diagramId) =>
  api.delete(DIAGRAMS.SINGLE(projectId, diagramId));

export const generateDiagram = (projectId, body) =>
  api.post(DIAGRAMS.GENERATE(projectId), body, AI_TIMEOUT);

export const editDiagram = (projectId, { current_mermaid_code, edit_instruction }) =>
  api.post(DIAGRAMS.EDIT(projectId), { current_mermaid_code, edit_instruction }, AI_TIMEOUT);

export const updateDiagramRequirements = (projectId, diagramId, requirementIds) =>
  api.put(DIAGRAMS.REQUIREMENTS(projectId, diagramId), { requirement_ids: requirementIds });
