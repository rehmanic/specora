import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/prismaClient.js";
import { validateAuthInput } from "../../../utils/inputValidator.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate input
    const validationError = validateAuthInput({ username, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: { username, email, password_hash },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        userId: user.id,
        userName: user.username,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        profilePicUrl: user.profile_pic_url,
        permissions: user.permissions,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate input
    const validationError = validateAuthInput({ username, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Find user
    const user = await prisma.users.findUnique({ where: { username } });

    // Check password
    const valid = user && (await bcrypt.compare(password, user.password_hash));
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );

    res.json({
      token,
      user: {
        userId: user.id,
        userName: user.username,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        profilePicUrl: user.profile_pic_url,
        permissions: user.permissions,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
