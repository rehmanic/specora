import prisma from "../../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

/**
 * 1. Create a user (admin only)
 */
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, display_name, profile_pic_url } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
        role: role || "client",
        display_name,
        profile_pic_url,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        display_name: true,
        profile_pic_url: true,
        created_at: true,
      },
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        display_name: true,
        profile_pic_url: true,
        created_at: true,
        updated_at: true
      }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
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
        created_at: true,
        updated_at: true
      }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * 4. Update current user's profile
 */
export const updateUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { display_name, profile_pic_url } = req.body;

    const updatedUser = await prisma.users.update({
      where: {username : username },
      data: { display_name, profile_pic_url },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        display_name: true,
        profile_pic_url: true,
        updated_at: true
      }
    });

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * 5. Delete a user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    await prisma.users.delete({ where: { username } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
