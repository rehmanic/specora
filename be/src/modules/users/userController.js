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

    // Get role
    const role = await prisma.role.findUnique({ where: { name: user.role || "client" } });
    if (!role) {
      return res.status(500).json({ message: "Role not found" });
    }

    // Create new user
    const newUser = await prisma.app_user.create({
      data: {
        username: user.username,
        password_hash,
        role_id: role.id,
        email: user.email,
        profile_pic_url: user.profile_pic_url,
        display_name: user.display_name,
      },
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const { password_hash: _, ...userWithoutPassword } = newUser;

    const finalUser = {
      ...userWithoutPassword,
      role: newUser.role?.name,
      permissions: newUser.role?.role_permission?.map((rp) => rp.permission.name) || [],
    };

    res.status(201).json({
      message: "User created successfully",
      user: finalUser,
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
    const users = await prisma.app_user.findMany({
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      profile_pic_url: user.profile_pic_url,
      role: user.role?.name,
      permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || [],
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    res.status(200).json({
      message: "Users retrieved successfully",
      count: formattedUsers.length,
      users: formattedUsers,
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

    const user = await prisma.app_user.findUnique({
      where: { username },
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      profile_pic_url: user.profile_pic_url,
      role: user.role?.name,
      permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || [],
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res
      .status(200)
      .json({ user: formattedUser, message: "User retrieved successfully" });
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

    const users = await prisma.app_user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      profile_pic_url: user.profile_pic_url,
      role: user.role?.name,
      permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || [],
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    res.status(200).json({
      message: "Users retrieved successfully",
      count: formattedUsers.length,
      data: formattedUsers,
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

    // Prepare update data
    const updateData = {
      username: user.username,
      email: user.email,
      profile_pic_url: user.profile_pic_url,
      display_name: user.display_name,
    };

    // Update role if provided
    if (user.role) {
      const role = await prisma.role.findUnique({ where: { name: user.role } });
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      updateData.role_id = role.id;
    }

    // Only hash and update password if provided
    if (user.password && user.password.trim().length > 0) {
      updateData.password_hash = await bcrypt.hash(user.password, 10);
    }

    const updatedUser = await prisma.app_user.update({
      where: { username: user.username },
      data: updateData,
      include: {
        role: {
          include: {
            role_permission: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    const finalUser = {
      ...userWithoutPassword,
      role: updatedUser.role?.name,
      permissions: updatedUser.role?.role_permission?.map((rp) => rp.permission.name) || [],
    };

    res.status(200).json({
      message: "User updated successfully",
      user: finalUser,
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

    const existingUser = await prisma.app_user.findUnique({ where: { username } });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.app_user.delete({ where: { username } });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
