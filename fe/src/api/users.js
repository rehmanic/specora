import { api } from "./client";
import { USERS } from "./endpoints";

// ======================
// NEW USER
// ======================
export const createUserRequest = (userData) =>
  api.post(USERS.CREATE, userData);

// ======================
// GET ALL USERS
// ======================
export const getAllUsersRequest = () =>
  api.get(USERS.ALL);

// ======================
// DELETE USER
// ======================
export const deleteUserRequest = (username) =>
  api.delete(USERS.SINGLE(username));

// ======================
// UPDATE USER
// ======================
export const updateUserRequest = (userData) =>
  api.put(USERS.SINGLE(userData.username), userData);

// ======================
// GET SINGLE USER
// ======================
export async function getSingleUserDataRequest(username) {
  const data = await api.get(USERS.SINGLE(username));
  // Backend returns { user: {...}, message: "..." }
  return data.user || data;
}

// ======================
// GET USERS BY IDS
// ======================
export const getUsersByIds = (userIds) =>
  api.post(USERS.BY_IDS, { userIds });
