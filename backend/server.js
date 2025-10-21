import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import prisma from "./prisma/prismaClient.js";

dotenv.config();

const PORT = process.env.PORT;
const server = http.createServer(app);

async function init() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

init();
