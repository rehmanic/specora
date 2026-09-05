import prisma from "../db/prismaClient.js";


export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("DB CONNECTED");
    return prisma;
  } catch (error) {
    console.error("DB CONNECTION FAILED:", error.message);
    process.exit(1);
  }
}
