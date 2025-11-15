import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUsersByIds,
} from "../users/userController.js";
import { verifyToken } from "../../middlewares/auth/verifyToken.js";
import requireManager from "../../middlewares/roleCheck.js";
import requireField from "../../middlewares/common/requireFields.js";
import checkUserExists from "../../middlewares/common/checkUserExists.js";
import { validateUserDataInput } from "../../middlewares/users/inputValidation.js";

const router = express.Router();

router.use(verifyToken);
router.use(requireManager);

// CREATE
router.post(
  "/create",
  requireField(["username", "email", "password", "role", "display_name"]),
  checkUserExists("signup"),
  validateUserDataInput,
  createUser
);

// READ
router.get("/all", getAllUsers);
router.get("/ids", getUsersByIds);
router.get("/:username", getUserByUsername);

// UPDATE
router.put(
  "/:username",
  requireField(["username", "email", "password", "role", "display_name"]),
  checkUserExists("login"),
  validateUserDataInput,
  updateUser
);

// DELETE
router.delete("/:username", deleteUser);

export default router;
