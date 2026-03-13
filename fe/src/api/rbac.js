import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function request(url, options = {}) {
  const { token } = useAuthStore.getState();
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(responseData?.message || `Request failed with status ${res.status}`);
  }

  return responseData;
}

// ROLES
export const getAllRolesRequest = () => request("/rbac/roles");
export const getRoleByIdRequest = (id) => request(`/rbac/roles/${id}`);
export const createRoleRequest = (data) => request("/rbac/roles", { method: "POST", body: JSON.stringify(data) });
export const updateRoleRequest = (id, data) => request(`/rbac/roles/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteRoleRequest = (id) => request(`/rbac/roles/${id}`, { method: "DELETE" });

// PERMISSIONS
export const getAllPermissionsRequest = () => request("/rbac/permissions");
export const getPermissionByIdRequest = (id) => request(`/rbac/permissions/${id}`);
export const createPermissionRequest = (data) => request("/rbac/permissions", { method: "POST", body: JSON.stringify(data) });
export const updatePermissionRequest = (id, data) => request(`/rbac/permissions/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deletePermissionRequest = (id) => request(`/rbac/permissions/${id}`, { method: "DELETE" });

// ASSIGNMENTS
export const assignPermissionToRoleRequest = (roleId, permissionId) => 
  request(`/rbac/roles/${roleId}/permissions`, { method: "POST", body: JSON.stringify({ permissionId }) });
export const removePermissionFromRoleRequest = (roleId, permissionId) => 
  request(`/rbac/roles/${roleId}/permissions/${permissionId}`, { method: "DELETE" });
