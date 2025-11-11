import prisma from "../../../config/db/prismaClient.js";
import bcrypt from "bcrypt";
import { validateUserInput } from "../../../utils/inputValidator.js";

/**
 * 1. Create a user (admin only)
 */
export const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      display_name,
      profile_pic_url,
      permissions,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !display_name ||
      !permissions
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate fields
    const validationError = validateUserInput({
      username,
      email,
      password,
      role,
      display_name,
      profile_pic_url,
      permissions,
    });
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

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        role: role,
        display_name: display_name,
        profile_pic_url: profile_pic_url,
        permissions: permissions,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        display_name: true,
        profile_pic_url: true,
        permissions: true,
        created_at: true,
      },
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 2. Get a single user by Username (admin only)
 */
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.users.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        permissions: true,
        display_name: true,
        profile_pic_url: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 3. Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        display_name: true,
        profile_pic_url: true,
        permissions: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 4. Update current user's profile
 */
export const updateUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      display_name,
      profile_pic_url,
      permissions,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !display_name ||
      !profile_pic_url ||
      !permissions
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validationError = validateUserInput({
      email,
      password,
      role,
      display_name,
      profile_pic_url,
      permissions,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updateData = {
      email: email ?? existingUser.email,
      role: role ?? existingUser.role,
      display_name: display_name ?? existingUser.display_name,
      profile_pic_url: profile_pic_url ?? existingUser.profile_pic_url,
      permissions: permissions ?? existingUser.permissions,
    };

    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { username },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        display_name: true,
        profile_pic_url: true,
        permissions: true,
        updated_at: true,
      },
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

/**
 * 5. Delete a user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.users.delete({ where: { username } });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
