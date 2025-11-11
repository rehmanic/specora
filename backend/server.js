import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import prisma from "./config/db/prismaClient.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function init() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected. Server shutting down.");
  process.exit(0);
});

init();
