import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../config/db/prismaClient.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const role = await prisma.role.findUnique({ where: { name: "client" } });
    if (!role) {
      return res.status(500).json({ message: "Default role not found" });
    }

    const user = await prisma.app_user.create({
      data: { username, email, password_hash, role_id: role.id },
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

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role.name },
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

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: finalUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
      { userId: user.id, username: user.username, role: user.role?.name },
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
