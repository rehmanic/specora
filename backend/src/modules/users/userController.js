import prisma from "../../../prisma/prismaClient.js";

/**
 * Get all users (admin only)
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
 * Get a single user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id },
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
 * Update current user's profile
 */
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { display_name, profile_pic_url } = req.body;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
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
 * Delete a user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
