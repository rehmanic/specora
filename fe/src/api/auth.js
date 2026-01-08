import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function loginRequest(credentials) {
  try {
    const { token } = useAuthStore.getState();

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
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
        data?.message || `Login failed${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data; // { user, token }
  } catch (err) {
    // Re-throw if it's already an Error with a message
    if (err instanceof Error) {
      throw err;
    }
    // Handle network errors and other unexpected errors
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

export async function signupRequest(credentials) {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
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
        data?.message || `Signup failed${res.status ? ` (${res.status})` : ""}`
      );
    }

    return data; // { user, token }
  } catch (err) {
    // Re-throw if it's already an Error with a message
    if (err instanceof Error) {
      throw err;
    }
    // Handle network errors and other unexpected errors
    throw new Error(
      err?.message || "Network error. Please check your connection and try again."
    );
  }
}

export function logoutRequest() {
  // Optional: call backend logout if needed
  return Promise.resolve();
}
