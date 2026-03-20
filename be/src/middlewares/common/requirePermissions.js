/**
 * Permission-based access control middleware.
 * Checks that the authenticated user (decoded JWT on req.user)
 * possesses ALL of the specified permissions before allowing access.
 *
 * Usage:  router.get("/", requirePermissions("view_users"), handler);
 *         router.post("/", requirePermissions("create_project", "view_projects"), handler);
 */
export const requirePermissions = (...permissions) => (req, res, next) => {
  const userPermissions = req.user.permissions || [];
  const hasAll = permissions.every((p) => userPermissions.includes(p));

  if (!hasAll) {
    return res
      .status(403)
      .json({ message: "Access denied: Missing required permissions" });
  }

  next();
};
