import prisma from "../db/prismaClient.js";

/**
 * Connects to the database using Prisma Client.
 * @returns {Promise<typeof prisma>} Active Prisma client instance
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    return prisma;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}
