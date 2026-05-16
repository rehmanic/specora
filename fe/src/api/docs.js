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

export const getDocs = (projectId) => request(`/docs/${projectId}`);

export const getDocById = (projectId, docId) => request(`/docs/${projectId}/${docId}`);

export const createDoc = async (projectId, docData) => {
  const data = await request(`/docs/${projectId}`, {
    method: "POST",
    body: JSON.stringify(docData),
  });
  return data.doc;
};

export const updateDoc = async (projectId, docId, docData) => {
  const data = await request(`/docs/${projectId}/${docId}`, {
    method: "PUT",
    body: JSON.stringify(docData),
  });
  return data.doc;
};

export const deleteDoc = (projectId, docId) => request(`/docs/${projectId}/${docId}`, { method: "DELETE" });

export const updateDocRequirements = (projectId, docId, requirementIds) =>
  request(`/docs/${projectId}/${docId}/requirements`, {
    method: "PUT",
    body: JSON.stringify({ requirementIds }),
  });

export const generateDoc = async (projectId, docId, { useCaseContext } = {}) => {
  const data = await request(`/docs/${projectId}/${docId}/generate`, {
    method: "POST",
    body: JSON.stringify({ useCaseContext }),
  });
  return data;
};

export const editDocWithAI = async (projectId, docId, { editInstructions, currentContent }) => {
  const data = await request(`/docs/${projectId}/${docId}/edit-with-ai`, {
    method: "POST",
    body: JSON.stringify({ editInstructions, currentContent }),
  });
  return data;
};

// format = "pdf" | "docx"
export const exportDoc = async (projectId, docId, format, filename) => {
  const token = useAuthStore.getState().token;
  const response = await fetch(
    `${API_BASE}/docs/${projectId}/${docId}/export/${format}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!response.ok) throw new Error(`Export failed (${response.status})`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
