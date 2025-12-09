import dotenv from "dotenv";
import http from "http"; // Node HTTP module to create server
import app from "./app.js"; // Express app instance
import prisma from "./config/db/prismaClient.js"; // Prisma client for DB access

dotenv.config(); // Initialize environment variables

const PORT = process.env.PORT || 5000; 
const server = http.createServer(app);

// ----- Initialize Server & Database -----
async function init() {
  try {
    await prisma.$connect(); // Connect DB
    console.log("✅ Database connected successfully");

    server.listen(PORT, () => {
      console.log(
        `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message); // Log DB connection errors
    process.exit(1); // Exit process with error code
  }
}

// ----- Graceful Shutdown -----
process.on("SIGINT", async () => {
  await prisma.$disconnect(); // Disconnect DB
  console.log("🛑 Prisma disconnected. Server shutting down.");
  process.exit(0); // Exit process successfully
});

init(); // Run initialization
