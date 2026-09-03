/**
 * Binds the HTTP server to the specified port and begins listening for connections.
 * @param {import("http").Server} server Active HTTP server instance
 * @param {number} port TCP port to listen on
 * @param {string} envMode Environment mode (e.g. "development", "production")
 * @returns {Promise<void>} Resolves when server is successfully listening
 */
export function startServer(server, port, envMode) {
  return new Promise((resolve) => {
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Fatal Error: Port ${port} is already in use by another process.`);
      } else {
        console.error("❌ Fatal HTTP Server Error:", error);
      }
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`🚀 Server running in ${envMode} mode on port ${port}`);
      resolve();
    });
  });
}
