/**
 * Registers process lifecycle signal handlers for graceful application shutdown.
 * @param {import("http").Server} server Active HTTP server instance
 * @param {import("@prisma/client").PrismaClient} prisma Active Prisma client instance
 */
export function setupGracefulShutdown(server, prisma) {
  const shutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Shutting down safely...`);

    // Safety fallback timeout (10 seconds)
    const forceExitTimeout = setTimeout(() => {
      console.error("⚠️ Graceful shutdown timed out after 10s. Forcing exit.");
      process.exit(1);
    }, 10000);

    // Prevent timeout from keeping process alive if everything closes cleanly
    if (typeof forceExitTimeout.unref === "function") {
      forceExitTimeout.unref();
    }

    server.close(async () => {
      console.log("🛑 HTTP server closed.");

      try {
        await prisma.$disconnect();
        console.log("🛑 Prisma disconnected successfully.");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error disconnecting Prisma during shutdown:", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
