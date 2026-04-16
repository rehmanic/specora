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
  const missingPermissions = permissions.filter((p) => !userPermissions.includes(p));

  if (missingPermissions.length > 0) {
    return res
      .status(403)
      .json({ 
        message: `Missing required permissions: ${missingPermissions.join(", ")}`,
        missing: missingPermissions
      });
  }

  next();
};
