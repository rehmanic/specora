import bcrypt from "bcrypt";
import prisma from "../../../../config/db/prismaClient.js";
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

const USER_INCLUDES = {
  role: {
    include: {
      role_permission: {
        include: {
          permission: true,
        },
      },
    },
  },
};

// ─── Service Functions ────────────────────────────────────

export async function createUser(userData) {
  const { password, role, ...rest } = userData;

  const password_hash = await bcrypt.hash(password, 10);

  const roleRecord = await prisma.role.findUnique({
    where: { name: role || "client" },
  });

  if (!roleRecord) {
    throw new AppError("Role not found", 404);
  }

  const newUser = await prisma.app_user.create({
    data: {
      ...rest,
      password_hash,
      role_id: roleRecord.id,
    },
    include: USER_INCLUDES,
  });

  return formatUser(newUser);
}

export async function getAllUsers() {
  const users = await prisma.app_user.findMany({
    include: {
      ...USER_INCLUDES,
      _count: {
        select: { project_member: true },
      },
    },
  });

  if (!users || users.length === 0) {
    throw new AppError("No users found", 404);
  }

  return users.map(formatUser);
}

export async function getUserByUsername(username) {
  const user = await prisma.app_user.findUnique({
    where: { username },
    include: USER_INCLUDES,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return formatUser(user);
}

export async function getUsersByIds(userIds) {
  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    throw new AppError("userIds array is required", 400);
  }

  const users = await prisma.app_user.findMany({
    where: { id: { in: userIds } },
    include: USER_INCLUDES,
  });

  return users.map(formatUser);
}

export async function updateUser(userData) {
  const { username, password, role, ...rest } = userData;

  const updateData = { ...rest };

  if (role) {
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      throw new AppError("Role not found", 404);
    }
    updateData.role_id = roleRecord.id;
  }

  if (password && password.trim().length > 0) {
    updateData.password_hash = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.app_user.update({
      where: { username },
      data: updateData,
      include: USER_INCLUDES,
    });
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
    await prisma.app_user.delete({ where: { username } });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
}
