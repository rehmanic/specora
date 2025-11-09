import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createUserRequest(userData) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "User creation failed");
  }

  return responseData;
}

export async function getAllUsersRequest() {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/users`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Fetching all users failed");
  }

  return responseData;
}

export async function deleteUserRequest(username) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/users/${username}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "User deletion failed");
  }

  return responseData;
}

export async function updateUserRequest(userData) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/users/${userData.username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "User updation failed");
  }

  return responseData;
}

export async function getSingleUserDataRequest(username) {
  const { token } = useAuthStore.getState();

  const res = await fetch(`${API_BASE}/users/${username}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData.message || "Fetching user details failed");
  }

  return responseData;
}
