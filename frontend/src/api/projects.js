import useAuthStore  from "@/store/authStore";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
