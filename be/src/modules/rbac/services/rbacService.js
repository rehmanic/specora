import * as rbacRepo from "../repositories/rbacRepository.js";
import AppError from "../../../utils/AppError.js";

// ─── ROLES ────────────────────────────────────────────────

export async function getAllRoles() {
  const roles = await rbacRepo.findAllRoles();

  return roles.map((role) => ({
    id: role.id,
    name: role.name,
    permissions: role.role_permission.map((rp) => rp.permission),
  }));
}

export async function getRoleById(id) {
  const role = await rbacRepo.findRoleById(id);

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
    return await rbacRepo.createRoleWithPermissions(name, permissionIds);
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Role name already exists", 400);
    throw error;
  }
}

export async function updateRole(id, name) {
  try {
    return await rbacRepo.updateRole(id, name);
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Role not found", 404);
    throw error;
  }
}

export async function deleteRole(id) {
  try {
    await rbacRepo.deleteRoleTransaction(id);
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
  return await rbacRepo.findAllPermissions();
}

export async function getPermissionById(id) {
  const permission = await rbacRepo.findPermissionById(id);
  if (!permission) throw new AppError("Permission not found", 404);
  return permission;
}

export async function createPermission(data) {
  const { name, label, description, module: moduleName } = data;
  try {
    return await rbacRepo.createPermission({ name, label, description, module: moduleName });
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Permission name already exists", 400);
    throw error;
  }
}

export async function updatePermission(id, data) {
  const { name, label, description, module: moduleName } = data;
  try {
    return await rbacRepo.updatePermission(id, { name, label, description, module: moduleName });
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Permission not found", 404);
    throw error;
  }
}

export async function deletePermission(id) {
  try {
    await rbacRepo.deletePermissionTransaction(id);
  } catch (error) {
    if (error.code === "P2025") throw new AppError("Permission not found", 404);
    throw error;
  }
}

// ─── ROLE-PERMISSION ASSIGNMENT ───────────────────────────

export async function assignPermissionToRole(roleId, permissionId) {
  try {
    return await rbacRepo.createRolePermission(roleId, permissionId);
  } catch (error) {
    if (error.code === "P2002") throw new AppError("Permission already assigned to this role", 400);
    throw error;
  }
}

export async function removePermissionFromRole(roleId, permissionId) {
  const existing = await rbacRepo.findRolePermission(roleId, permissionId);

  if (!existing) throw new AppError("Assignment not found", 404);

  await rbacRepo.deleteRolePermissionById(existing.id);
}
