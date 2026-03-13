import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
} from "./rbacController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requireManager } from "../../middlewares/common/roleCheck.js";
import requireField from "../../middlewares/common/requireFields.js";

const router = express.Router();

// All RBAC routes require manager access
router.use(verifyToken);
router.use(requireManager);

// Role routes
router.get("/roles", getAllRoles);
router.get("/roles/:id", getRoleById);
router.post("/roles", requireField(["name"]), createRole);
router.put("/roles/:id", requireField(["name"]), updateRole);
router.delete("/roles/:id", deleteRole);

// Permission routes
router.get("/permissions", getAllPermissions);
router.get("/permissions/:id", getPermissionById);
router.post("/permissions", requireField(["name"]), createPermission);
router.put("/permissions/:id", requireField(["name"]), updatePermission);
router.delete("/permissions/:id", deletePermission);

// Role-Permission Assignment
router.post("/roles/:roleId/permissions", requireField(["permissionId"]), assignPermissionToRole);
router.delete("/roles/:roleId/permissions/:permissionId", removePermissionFromRole);

export default router;
