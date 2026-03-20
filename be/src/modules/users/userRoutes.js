import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUsersByIds,
} from "../users/userController.js";
import { verifyToken } from "../../middlewares/common/verifyToken.js";
import { requirePermissions } from "../../middlewares/common/requirePermissions.js";
import requireField from "../../middlewares/common/requireFields.js";
import checkUserExists from "../../middlewares/common/checkUserExists.js";
import { validateUserDataInput } from "../../middlewares/users/inputValidation.js";

const router = express.Router();

router.use(verifyToken);

// CREATE
router.post(
  "/create",
  requirePermissions("add_user"),
  requireField(["username", "email", "password", "role", "display_name"]),
  validateUserDataInput,
  checkUserExists("by-username-email"),
  createUser
);

// READ
router.get("/all", requirePermissions("view_users"), getAllUsers);
router.post("/ids", requirePermissions("view_users"), getUsersByIds);
router.get("/:username", requirePermissions("view_users"), checkUserExists("by-username"), getUserByUsername);

// UPDATE
router.put(
  "/:username",
  requirePermissions("update_user"),
  validateUserDataInput,
  checkUserExists("by-username"),
  updateUser
);

// DELETE
router.delete("/:username", requirePermissions("delete_user"), checkUserExists("by-username"), deleteUser);

export default router;
