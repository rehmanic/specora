const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getAllProjects(token) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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
  }
}
