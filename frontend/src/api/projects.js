import useAuthStore from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ======================
// Get All Projects
// ======================
export async function getAllProjects(token) {
  try {
<<<<<<< HEAD
    const res = await fetch(`${API_BASE}/api/projects/all`, {
=======
    const res = await fetch(`${API_BASE}/projects/all`, {
>>>>>>> 86e1e37bca1ea509e0766fc2bb89914356b2a5e3
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

<<<<<<< HEAD
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("❌ Projects API HTTP Error:");
      console.error("   Status:", res.status, res.statusText);
      console.error("   Details:", errData);
      throw new Error(errData.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    // Network errors (CORS, connection refused, etc.)
    if (error.message.includes("fetch")) {
      console.error("❌ Projects API Network Error:", error.message);
      console.error("   API Base URL:", API_BASE);
      console.error("   Full URL:", `${API_BASE}/api/projects/all`);
      throw new Error("Cannot connect to backend server. Please check if the backend is running.");
    }
    throw error;
=======
    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error(
        "Server response is invalid. Please try again later."
      );
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
          `Failed to fetch projects${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
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
      throw new Error(
        "Server response is invalid. Please try again later."
      );
    }

    if (!res.ok) {
      throw new Error(
        responseData?.message ||
          `Fetching user projects failed${res.status ? ` (${res.status})` : ""}`
      );
    }

    return responseData;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

// ======================
// Create Project
// ======================
export async function createProject(projectData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/create`, {
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
      throw new Error(
        "Server response is invalid. Please try again later."
      );
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
          `Failed to create project${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

// ======================
// Update Project
// ======================
export async function updateProject(projectId, updateData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/update/${projectId}`, {
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
      throw new Error(
        "Server response is invalid. Please try again later."
      );
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
          `Failed to update project${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

// ======================
// Delete Project
// ======================
export async function deleteProject(projectId) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/projects/delete/${projectId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    let data;
    try {
      data = await res.json();
    } catch (parseError) {
      throw new Error(
        "Server response is invalid. Please try again later."
      );
    }

    if (!res.ok) {
      throw new Error(
        data?.message ||
          `Failed to delete project${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
>>>>>>> 86e1e37bca1ea509e0766fc2bb89914356b2a5e3
  }
}
