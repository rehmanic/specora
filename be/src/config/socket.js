import { Server } from "socket.io";
import { registerChatSocketHandlers } from "../modules/chat/services/chatSocketService.js";

export function attachWebSockets(httpServer, CORS_ORIGIN) {
  const io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });

  // Register socket event handlers for modules
  registerChatSocketHandlers(io);

  return io;
}
