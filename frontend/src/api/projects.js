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
