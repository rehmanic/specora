import { api } from "./client";
import { RBAC } from "./endpoints";

// ROLES
export const getAllRolesRequest = () => api.get(RBAC.ROLES);
export const getRoleByIdRequest = (id) => api.get(RBAC.ROLE(id));
export const createRoleRequest = (data) => api.post(RBAC.ROLES, data);
export const updateRoleRequest = (id, data) => api.put(RBAC.ROLE(id), data);
export const deleteRoleRequest = (id) => api.delete(RBAC.ROLE(id));

// PERMISSIONS
export const getAllPermissionsRequest = () => api.get(RBAC.PERMISSIONS);
export const getPermissionByIdRequest = (id) => api.get(RBAC.PERMISSION(id));
export const createPermissionRequest = (data) => api.post(RBAC.PERMISSIONS, data);
export const updatePermissionRequest = (id, data) => api.put(RBAC.PERMISSION(id), data);
export const deletePermissionRequest = (id) => api.delete(RBAC.PERMISSION(id));

// ASSIGNMENTS
export const assignPermissionToRoleRequest = (roleId, permissionId) =>
  api.post(RBAC.ROLE_PERMISSIONS(roleId), { permissionId });
export const removePermissionFromRoleRequest = (roleId, permissionId) =>
  api.delete(RBAC.ROLE_PERMISSION(roleId, permissionId));
