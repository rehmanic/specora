import useAuthStore from "@/store/authStore";

/**
 * Check if the current user has a specific permission.
 * @param {string} permission - Permission name to check
 * @returns {boolean}
 */
export function usePermission(permission) {
  const { user } = useAuthStore();
  return user?.permissions?.includes(permission) ?? false;
}

/**
 * Check if the current user has ALL of the specified permissions.
 * @param {...string} permissions - Permission names to check
 * @returns {boolean}
 */
export function usePermissions(...permissions) {
  const { user } = useAuthStore();
  const userPerms = user?.permissions || [];
  return permissions.every((p) => userPerms.includes(p));
}
