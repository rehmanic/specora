import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { setupVideoWebSocket } from "./modules/video/routes.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupVideoWebSocket(io);

const server = httpServer.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 Specora Backend API Server                      ║
  ║                                                       ║
  ║   Environment: ${process.env.NODE_ENV || "development"}                           ║
  ║   Port: ${PORT}                                          ║
  ║   API URL: http://localhost:${PORT}/api                ║
  ║   🎥 WebSocket: Ready for video calls                ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\nSIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

export default server;
