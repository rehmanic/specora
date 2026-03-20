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
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";
import requireField from "../../middlewares/common/requireFields.js";

const router = express.Router();

router.use(verifyToken);

// Role routes
router.get("/roles", requirePermissions("view_roles"), getAllRoles);
router.get("/roles/:id", requirePermissions("view_roles"), getRoleById);
router.post("/roles", requirePermissions("create_role"), requireField(["name"]), createRole);
router.put("/roles/:id", requirePermissions("update_role"), requireField(["name"]), updateRole);
router.delete("/roles/:id", requirePermissions("delete_role"), deleteRole);

// Permission routes
router.get("/permissions", getAllPermissions);
router.get("/permissions/:id", requirePermissions("view_roles"), getPermissionById);
router.post("/permissions", requirePermissions("create_role"), requireField(["name"]), createPermission);
router.put("/permissions/:id", requirePermissions("update_role"), requireField(["name"]), updatePermission);
router.delete("/permissions/:id", requirePermissions("delete_role"), deletePermission);

// Role-Permission Assignment
router.post("/roles/:roleId/permissions", requirePermissions("update_role"), requireField(["permissionId"]), assignPermissionToRole);
router.delete("/roles/:roleId/permissions/:permissionId", requirePermissions("update_role"), removePermissionFromRole);

export default router;
