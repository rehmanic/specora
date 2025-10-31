import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/prismaClient.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { username, email, password_hash },
    });

    res.status(201).json({
      message: "User registered",
      user: {
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        profile_pic_url: user.profile_pic_url,
        permissions: user.permissions,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.users.findUnique({ where: { username } });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Send back token + user details
    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        profile_pic_url: user.profile_pic_url,
        permissions: user.permissions,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
