import { Server } from "socket.io";
import { registerChatSocketHandlers } from "../modules/chat/services/chatSocketService.js";

/**
 * Attach Socket.IO WebSocket protocol handlers to the HTTP server.
 * @param {import("http").Server} httpServer
 * @returns {Server}
 */
export function attachWebSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Register socket event handlers for modules
  registerChatSocketHandlers(io);

  return io;
}
