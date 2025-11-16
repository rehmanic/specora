import prisma from "../../../config/db/prismaClient.js";

export default function checkUserExists(action) {
  return async (req, res, next) => {
    try {
      let user;

      if (action === "by-username") {
        const { username } = req.body || req.params;
        user = await prisma.users.findUnique({ where: { username } });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      } else if (action === "by-id") {
        const { userId } = req.params;
        user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
      } else if (action === "by-username-email") {
        const { username, email } = req.body;
        user = await prisma.users.findFirst({
          where: { OR: [{ username }, { email }] },
        });

        if (user) {
          return res
            .status(404)
            .json({ message: "Username or email already in use" });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Check user exists error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
