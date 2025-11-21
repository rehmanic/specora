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
