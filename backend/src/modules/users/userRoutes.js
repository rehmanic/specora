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

const router = express.Router();
router.use(verifyToken);


router.post("/create", requireManager, createUser);
router.post("/by-ids", requireManager, getUsersByIds);
router.get("/:username", requireManager, getUserByUsername);
router.get("/", requireManager, getAllUsers);
router.put("/:username", updateUser);
router.delete("/:username", requireManager, deleteUser);

export default router;
