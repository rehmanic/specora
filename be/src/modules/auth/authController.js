import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../config/db/prismaClient.js";

export async function signup(req, res) {
  return res.status(403).json({ 
    message: "Registration is currently frozen. Please contact an administrator." 
  });
}

export async function login(req, res) {
  try {
    const { password } = req.body;
    const user = req.user;

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role?.name,
        permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || []
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    const { password_hash: _, ...userWithoutPassword } = user;

    const finalUser = {
      ...userWithoutPassword,
      role: user.role?.name,
      permissions:
        user.role?.role_permission?.map((rp) => rp.permission.name) || [],
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: finalUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
