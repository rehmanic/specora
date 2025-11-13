import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import prisma from "./config/db/prismaClient.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

<<<<<<< HEAD
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop other services or change the PORT.`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`📅 Meetings API: http://localhost:${PORT}/api/meetings`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log("\n🛑 Shutting down gracefully...");
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

=======
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
>>>>>>> 1d92dc37310190999720abb608b6675da2791214
