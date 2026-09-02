import prisma from "../../../../config/db/prismaClient.js";
import AppError from "../../../utils/AppError.js";

// ─── ROLES ────────────────────────────────────────────────

export async function getAllRoles() {
  const roles = await prisma.role.findMany({
    include: {
      role_permission: {
        include: { permission: true },
      },
    },
  });

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    permissions: role.role_permission.map((rp) => rp.permission),
  }));
}

export async function getRoleById(id) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      role_permission: {
        include: { permission: true },
      },
    },
  });

  if (!role) throw new AppError("Role not found", 404);

  return {
    id: role.id,
    name: role.name,
    permissions: role.role_permission.map((rp) => rp.permission),
  };
}

export async function createRole(data) {
  const { name, permissionIds } = data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({ data: { name } });

      if (permissionIds && permissionIds.length > 0) {
        await tx.role_permission.createMany({
          data: permissionIds.map((pId) => ({
            role_id: newRole.id,
            permission_id: pId,
          })),
        });
      }
      return newRole;
    });

    return result;
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Role name already exists", 400);
    throw error;
  }
}

export async function updateRole(id, name) {
  try {
    return await prisma.role.update({
      where: { id },
      data: { name },
    });
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Role not found", 404);
    throw error;
  }
}

export async function deleteRole(id) {
  try {
    await prisma.$transaction([
      prisma.role_permission.deleteMany({ where: { role_id: id } }),
      prisma.role.delete({ where: { id } }),
    ]);
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Role not found", 404);
    if (error.code === "P2003") {
      throw new AppError("Cannot delete role because it is still assigned to users. Please reassign users before deleting.", 400);
    }
    throw error;
  }
}

// ─── PERMISSIONS ──────────────────────────────────────────

export async function getAllPermissions() {
  return await prisma.permission.findMany();
}

export async function getPermissionById(id) {
  const permission = await prisma.permission.findUnique({ where: { id } });
  if (!permission) throw new AppError("Permission not found", 404);
  return permission;
}

export async function createPermission(data) {
  const { name, label, description, module: moduleName } = data;
  try {
    return await prisma.permission.create({
      data: { name, label, description, module: moduleName },
    });
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Permission name already exists", 400);
    throw error;
  }
}

export async function updatePermission(id, data) {
  const { name, label, description, module: moduleName } = data;
  try {
    return await prisma.permission.update({
      where: { id },
      data: { name, label, description, module: moduleName },
    });
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Permission not found", 404);
    throw error;
  }
}

export async function deletePermission(id) {
  try {
    await prisma.$transaction([
      prisma.role_permission.deleteMany({ where: { permission_id: id } }),
      prisma.permission.delete({ where: { id } }),
    ]);
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Permission not found", 404);
    throw error;
  }
}

// ─── ROLE-PERMISSION ASSIGNMENT ───────────────────────────

export async function assignPermissionToRole(roleId, permissionId) {
  try {
    return await prisma.role_permission.create({
      data: { role_id: roleId, permission_id: permissionId },
      include: { permission: true },
    });
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Permission already assigned to this role", 400);
    throw error;
  }
}

export async function removePermissionFromRole(roleId, permissionId) {
  const existing = await prisma.role_permission.findFirst({
    where: { role_id: roleId, permission_id: permissionId },
  });

  if (!existing) throw new AppError("Assignment not found", 404);

  await prisma.role_permission.delete({ where: { id: existing.id } });
}
