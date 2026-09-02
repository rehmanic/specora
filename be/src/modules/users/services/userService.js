import bcrypt from "bcrypt";
import * as userRepo from "../repositories/userRepository.js";
import AppError from "../../../utils/AppError.js";

// ─── Helpers ──────────────────────────────────────────────

const formatUser = (u) => {
  const { password_hash, ...userWithoutPassword } = u;
  return {
    ...userWithoutPassword,
    role: u.role?.name,
    permissions: u.role?.role_permission?.map((rp) => rp.permission.name) || [],
    projects_count: u._count?.project_member || undefined,
  };
};

// ─── Service Functions ────────────────────────────────────

export async function createUser(userData) {
  const { password, role, ...rest } = userData;

  const password_hash = await bcrypt.hash(password, 10);

  const roleRecord = await userRepo.findRoleByName(role || "client");

  if (!roleRecord) {
    throw new AppError("Role not found", 404);
  }

  const newUser = await userRepo.createUserRecord({
      ...rest,
      password_hash,
      role_id: roleRecord.id,
  });

  return formatUser(newUser);
}

export async function getAllUsers() {
  const users = await userRepo.findAllUsers();

  if (!users || users.length === 0) {
    throw new AppError("No users found", 404);
  }

  return users.map(formatUser);
}

export async function getUserByUsername(username) {
  const user = await userRepo.findUserByUsername(username);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return formatUser(user);
}

export async function getUsersByIds(userIds) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new AppError("userIds array is required", 400);
  }

  const users = await userRepo.findUsersByIds(userIds);

  return users.map(formatUser);
}

export async function updateUser(userData) {
  const { username, password, role, ...rest } = userData;

  const updateData = { ...rest };

  if (role) {
    const roleRecord = await userRepo.findRoleByName(role);
    if (!roleRecord) {
      throw new AppError("Role not found", 404);
    }
    updateData.role_id = roleRecord.id;
  }

  if (password && password.trim().length > 0) {
    updateData.password_hash = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await userRepo.updateUserRecord(username, updateData);
    return formatUser(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
}

export async function deleteUser(username) {
  try {
    await userRepo.deleteUserRecord(username);
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
}
