const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function loginRequest(credentials) {

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  return data; // { user, token }
}

export async function signupRequest(credentials) {

  console.log(credentials);
  
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");

  return data; // { user, token }
}

export function logoutRequest() {
  // Optional: call backend logout if needed
  return Promise.resolve();
}
