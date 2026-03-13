import { create } from "zustand";
import {
  getAllRolesRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
  getAllPermissionsRequest,
  createPermissionRequest,
  updatePermissionRequest,
  deletePermissionRequest,
  assignPermissionToRoleRequest,
  removePermissionFromRoleRequest,
} from "@/api/rbac";

const useRbacStore = create((set, get) => ({
  roles: [],
  permissions: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllRolesRequest();
      set({ roles: data.roles, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPermissions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllPermissionsRequest();
      set({ permissions: data.permissions, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createRole: async (name, permissionIds = []) => {
    set({ loading: true, error: null });
    try {
      await createRoleRequest({ name, permissionIds });
      await get().fetchRoles();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateRole: async (id, name) => {
    set({ loading: true, error: null });
    try {
      await updateRoleRequest(id, { name });
      await get().fetchRoles();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteRole: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteRoleRequest(id);
      await get().fetchRoles();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  createPermission: async (name) => {
    set({ loading: true, error: null });
    try {
      await createPermissionRequest({ name });
      await get().fetchPermissions();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  assignPermission: async (roleId, permissionId) => {
    set({ loading: true, error: null });
    try {
      await assignPermissionToRoleRequest(roleId, permissionId);
      await get().fetchRoles();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removePermission: async (roleId, permissionId) => {
    set({ loading: true, error: null });
    try {
      await removePermissionFromRoleRequest(roleId, permissionId);
      await get().fetchRoles();
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useRbacStore;
