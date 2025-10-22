import express from "express";
import {
  createUser,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
} from "../users/userController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import requireManager from "../../middlewares/roleCheck.js";

const router = express.Router();
router.use(authenticateToken);


router.post("/create", requireManager, createUser);
router.get("/:username", requireManager, getUserByUsername);
router.get("/", requireManager, getAllUsers);
router.put("/:username", updateUser);
router.delete("/:username", requireManager, deleteUser);

export default router;
