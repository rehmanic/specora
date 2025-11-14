import prisma from "../../../config/db/prismaClient.js";

export default function checkUserExists(action) {
  return async (req, res, next) => {
    try {
      if (action === "signup") {
        const { username, email } = req.body;

        const existing = await prisma.users.findFirst({
          where: { OR: [{ username }, { email }] },
        });

        if (existing) {
          return res
            .status(409)
            .json({ message: "Username or email already exists" });
        }
      } else if (action === "login") {
        const { username } = req.body;
        const user = await prisma.users.findUnique({
          where: { username },
        });

        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        req.user = user;
      }

      next();
    } catch (error) {
      console.error("Check user exists error:", error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };
}
