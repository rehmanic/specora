export const requireManager = (req, res, next) => {
  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Manager access required" });
  }
  next();
};

export const requireClient = (req, res, next) => {
  if (req.user.role !== "client") {
    return res.status(403).json({ message: "Client access required" });
  }
  next();
};

// Allow a request when the authenticated role is in the provided list
export const requireRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied for this role" });
  }
  next();
};
// Allow a request when the authenticated user has all the provided permissions
export const requirePermissions = (...permissions) => (req, res, next) => {
  const userPermissions = req.user.permissions || [];
  const hasAllPermissions = permissions.every(p => userPermissions.includes(p));

  if (!hasAllPermissions) {
    return res.status(403).json({ message: "Access denied: Missing required permissions" });
  }
  next();
};
