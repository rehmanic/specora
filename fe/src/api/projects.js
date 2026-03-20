import useAuthStore from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ======================
// Get All Projects
// ======================
export async function getAllProjects(token) {
  try {
    const res = await fetch(`${API_BASE}/projects/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error("Server response is invalid. Please try again later.");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Failed to fetch projects${res.status ? ` (${res.status})` : ""}`);
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(err?.message || "Network error. Please check your connection and try again.");
  }
}

// ======================
// Get User Projects
// ======================
export async function getUserProjects(userId) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    let responseData;
    try {
      responseData = await res.json();
    } catch (parseError) {
      throw new Error("Server response is invalid. Please try again later.");
    }

    if (!res.ok) {
      throw new Error(responseData?.message || `Fetching user projects failed${res.status ? ` (${res.status})` : ""}`);
    }

    return responseData;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(err?.message || "Network error. Please check your connection and try again.");
  }
}

// ======================
// Create Project
// ======================
export async function createProject(projectData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error("Server response is invalid. Please try again later.");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Failed to create project${res.status ? ` (${res.status})` : ""}`);
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(err?.message || "Network error. Please check your connection and try again.");
  }
}

// ======================
// Update Project
// ======================
export async function updateProject(projectId, updateData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error("Server response is invalid. Please try again later.");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Failed to update project${res.status ? ` (${res.status})` : ""}`);
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(err?.message || "Network error. Please check your connection and try again.");
  }
}

// ======================
// Delete Project
// ======================
export async function deleteProject(projectId) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error("Server response is invalid. Please try again later.");
    }

    if (!res.ok) {
      throw new Error(data?.message || `Failed to delete project${res.status ? ` (${res.status})` : ""}`);
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(err?.message || "Network error. Please check your connection and try again.");
  }
}

// ======================
// Member Management
// ======================

/** Fetch all members for a project */
export async function getProjectMembers(projectId) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch project members");
  return data;
}

/** Add a member to a project */
export async function addProjectMember(projectId, memberId) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ memberId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to add member");
  return data;
}

/** Remove a member from a project */
export async function removeProjectMember(projectId, memberId) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/members/${memberId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to remove member");
  return data;
}

// ======================
// Tag Management
// ======================

/** Fetch all tags for a project */
export async function getProjectTags(projectId) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/tags`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to fetch project tags");
  return data;
}

/** Add a tag to a project */
export async function addProjectTag(projectId, tag) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ tag }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to add tag");
  return data;
}

/** Remove a tag from a project */
export async function removeProjectTag(projectId, tag) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}/projects/${projectId}/tags/${encodeURIComponent(tag)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Failed to remove tag");
  return data;
}

