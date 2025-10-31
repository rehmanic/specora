import express from "express";
import { signup, login } from "../auth/authController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, (req, res) => {
  res.json({ message: "Authenticated", user: req.user });
});

export default router;
