import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../../../utils/AppError.js";

/**
 * Authenticate a user and return a JWT token + sanitized user object.
 *
 * @param {object} user  The pre-loaded user record (from middleware).
 * @param {string} password  The plaintext password from the request body.
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(user, password) {
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role?.name,
      permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
  );

  const { password_hash: _, ...userWithoutPassword } = user;

  const finalUser = {
    ...userWithoutPassword,
    role: user.role?.name,
    permissions: user.role?.role_permission?.map((rp) => rp.permission.name) || [],
  };

  return { token, user: finalUser };
}
