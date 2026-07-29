import { api } from "./client";
import { DOCS } from "./endpoints";

const AI_TIMEOUT = { timeout: 60_000 };

export const getDocs = (projectId) =>
  api.get(DOCS.BY_PROJECT(projectId));

export const getDocById = (projectId, docId) =>
  api.get(DOCS.SINGLE(projectId, docId));

export async function createDoc(projectId, docData) {
  const data = await api.post(DOCS.BY_PROJECT(projectId), docData);
  return data.doc;
}

export async function updateDoc(projectId, docId, docData) {
  const data = await api.put(DOCS.SINGLE(projectId, docId), docData);
  return data.doc;
}

export const deleteDoc = (projectId, docId) =>
  api.delete(DOCS.SINGLE(projectId, docId));

export const updateDocRequirements = (projectId, docId, requirementIds) =>
  api.put(DOCS.REQUIREMENTS(projectId, docId), { requirementIds });

export const generateDoc = (projectId, docId, { useCaseContext } = {}) =>
  api.post(DOCS.GENERATE(projectId, docId), { useCaseContext }, AI_TIMEOUT);

export const editDocWithAI = (projectId, docId, { editInstructions, currentContent }) =>
  api.post(DOCS.EDIT_WITH_AI(projectId, docId), { editInstructions, currentContent }, AI_TIMEOUT);

// format = "pdf" | "docx"
export async function exportDoc(projectId, docId, format, filename) {
  const res = await api.raw(DOCS.EXPORT(projectId, docId, format));

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
