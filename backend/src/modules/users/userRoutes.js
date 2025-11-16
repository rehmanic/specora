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
import requireManager from "../../middlewares/common/roleCheck.js";
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
  validateUserDataInput,
  checkUserExists("by-username-email"),
  createUser
);

// READ
router.get("/all", getAllUsers);
router.post("/ids", getUsersByIds);
router.get("/:username", checkUserExists("by-username"), getUserByUsername);

// UPDATE
router.put(
  "/:username",
  requireField(["username", "email", "password", "role", "display_name"]),
  validateUserDataInput,
  checkUserExists("by-username"),
  updateUser
);

// DELETE
router.delete("/:username", checkUserExists("by-username"), deleteUser);

export default router;
