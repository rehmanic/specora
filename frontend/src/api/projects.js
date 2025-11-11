import useAuthStore from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ======================
// Get All Projects
// ======================
export async function getAllProjects(token) {
  const res = await fetch(`${API_BASE}/projects/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to fetch projects");
  }

  return res.json();
}

// ======================
// Get User Projects
// ======================
export async function getUserProjects(userId) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/projects/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Fetching user projects failed");
  }

  return responseData;
}

// ======================
// Create Project
// ======================
export async function createProject(projectData) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/projects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
}

// ======================
// Update Project
// ======================
export async function updateProject(projectId, updateData) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/projects/update/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
}

// ======================
// Delete Project
// ======================
export async function deleteProject(projectId) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/projects/delete/${projectId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
}
