import express from "express";
import { signup, login } from "../auth/authController.js";
import requireFeilds from "../../middlewares/common/requireFields.js";
import checkUserExists from "../../middlewares/common/checkUserExists.js";
import { validateSignupInput } from "../../middlewares/auth/inputValidation.js";

const router = express.Router();

// SIGNUP
router.post(
  "/signup",
  requireFeilds(["username", "email", "password"]),
  validateSignupInput,
  checkUserExists("by-username-email"),
  signup
);

// LOGIN
router.post(
  "/login",
  requireFeilds(["username", "password"]),
  checkUserExists("by-username"),
  login
);

export default router;
