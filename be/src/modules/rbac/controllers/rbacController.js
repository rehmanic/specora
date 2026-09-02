import asyncHandler from "../../../utils/asyncHandler.js";
import * as rbacService from "../services/rbacService.js";

// ─── ROLES ────────────────────────────────────────────────

export const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await rbacService.getAllRoles();
  res.status(200).json({ roles });
});

export const getRoleById = asyncHandler(async (req, res) => {
  const role = await rbacService.getRoleById(req.params.id);
  res.status(200).json({ role });
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await rbacService.createRole(req.body);
  res.status(201).json({ role, message: "Role created successfully" });
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await rbacService.updateRole(req.params.id, req.body.name);
  res.status(200).json({ role, message: "Role updated successfully" });
});

export const deleteRole = asyncHandler(async (req, res) => {
  await rbacService.deleteRole(req.params.id);
  res.status(200).json({ message: "Role deleted successfully" });
});

// ─── PERMISSIONS ──────────────────────────────────────────

export const getAllPermissions = asyncHandler(async (req, res) => {
  const permissions = await rbacService.getAllPermissions();
  res.status(200).json({ permissions });
});

export const getPermissionById = asyncHandler(async (req, res) => {
  const permission = await rbacService.getPermissionById(req.params.id);
  res.status(200).json({ permission });
});

export const createPermission = asyncHandler(async (req, res) => {
  const permission = await rbacService.createPermission(req.body);
  res.status(201).json({ permission, message: "Permission created successfully" });
});

export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await rbacService.updatePermission(req.params.id, req.body);
  res.status(200).json({ permission, message: "Permission updated successfully" });
});

export const deletePermission = asyncHandler(async (req, res) => {
  await rbacService.deletePermission(req.params.id);
  res.status(200).json({ message: "Permission deleted successfully" });
});

// ─── ROLE-PERMISSION ASSIGNMENT ───────────────────────────

export const assignPermissionToRole = asyncHandler(async (req, res) => {
  const assignment = await rbacService.assignPermissionToRole(req.params.roleId, req.body.permissionId);
  res.status(201).json({ message: "Permission assigned to role successfully", assignment });
});

export const removePermissionFromRole = asyncHandler(async (req, res) => {
  await rbacService.removePermissionFromRole(req.params.roleId, req.params.permissionId);
  res.status(200).json({ message: "Permission removed from role successfully" });
});
