import prisma from "../../../config/db/prismaClient.js";
import bcrypt from "bcrypt";

// ======================
// NEW USER
// ======================
export const createUser = async (req, res) => {
  try {
    const user = req.body;

    // Hash password
    const password_hash = await bcrypt.hash(user.password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        username: user.username,
        password_hash,
        role: user.role,
        permissions: user.permissions,
        email: user.email,
        profile_pic_url: user.profile_pic_url,
        display_name: user.display_name,
      },
      select: {
        id: true,
        username: true,
        password_hash: true,
        role: true,
        permissions: true,
        email: true,
        profile_pic_url: true,
        display_name: true,
        created_at: true,
      },
    });

    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ======================
// GET ALL USERS
// ======================
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
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// GET SINGLE USER BY USERNAME
// ============================
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

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ user: user, message: "User retrieved successfully" });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// GET USERS BY IDS
// ============================
export const getUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds array is required" });
    }

    const users = await prisma.users.findMany({
      where: {
        id: {
          in: userIds,
        },
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
        updated_at: true,
      },
    });

    res.status(200).json({
      message: "Users retrieved successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// UPDATE USER
// ============================
export const updateUser = async (req, res) => {
  try {
    const user = req.body;

    // Hash password
    const password_hash = await bcrypt.hash(user.password, 10);

    const updatedUser = await prisma.users.update({
      where: { username: user.username },
      data: {
        username: user.username,
        password_hash,
        role: user.role,
        permissions: user.permissions,
        email: user.email,
        profile_pic_url: user.profile_pic_url,
        display_name: user.display_name,
      },
      select: {
        id: true,
        username: true,
        password_hash: true,
        role: true,
        permissions: true,
        email: true,
        profile_pic_url: true,
        display_name: true,
        updated_at: true,
      },
    });

    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    res.status(200).json({
      message: "User updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ============================
// DELETE USER
// ============================
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;

    const existingUser = await prisma.users.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.users.delete({ where: { username } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
