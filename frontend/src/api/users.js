import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;


// ======================
// NEW USER
// ======================
export async function createUserRequest(userData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
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
          `User creation failed${res.status ? ` (${res.status})` : ""}`
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

export async function getAllUsersRequest() {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/all`, {
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
          `Fetching all users failed${res.status ? ` (${res.status})` : ""}`
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

export async function deleteUserRequest(username) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/${username}`, {
      method: "DELETE",
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
          `User deletion failed${res.status ? ` (${res.status})` : ""}`
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

export async function updateUserRequest(userData) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/${userData.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
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
          `User updation failed${res.status ? ` (${res.status})` : ""}`
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

export async function getSingleUserDataRequest(username) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/${username}`, {
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
          `Fetching user details failed${res.status ? ` (${res.status})` : ""}`
      );
    }

    // Backend returns { user: {...}, message: "..." }
    return responseData.user || responseData;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

export async function getUsersByIds(userIds) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/users/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userIds }),
    });

    let responseData;
    try {
      responseData = await res.json();
    } catch (parseError) {
      console.error("Error parsing response in getUsersByIds:", parseError);
      return [];
    }

    if (!res.ok) {
      console.error(
        "Error fetching users by IDs:",
        responseData?.message || `Failed (${res.status})`
      );
      return [];
    }

    return responseData.data || responseData;
  } catch (err) {
    console.error("Error fetching users by IDs:", err);
    // Return empty array on error for this function (it's used for optional data)
    return [];
  }
}
