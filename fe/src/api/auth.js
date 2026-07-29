import { api } from "./client";
import { AUTH } from "./endpoints";

export const loginRequest = (credentials) =>
  api.post(AUTH.LOGIN, credentials, { auth: false });

export const signupRequest = (credentials) =>
  api.post(AUTH.SIGNUP, credentials, { auth: false });

export function logoutRequest() {
  // Optional: call backend logout if needed
  return Promise.resolve();
}
