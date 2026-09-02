import asyncHandler from "../../../utils/asyncHandler.js";
import { loginUser } from "../services/authService.js";

export const signup = asyncHandler(async (req, res) => {
  res.status(403).json({
    message: "Registration is currently frozen. Please contact an administrator.",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = req.user;

  const result = await loginUser(user, password);

  res.status(200).json({
    message: "Login successful",
    token: result.token,
    user: result.user,
  });
});
