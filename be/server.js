import dotenv from "dotenv";
import http from "http"; // Node HTTP module to create server
import { Server } from "socket.io"; // Socket.IO
import app from "./app.js"; // Express app instance
import prisma from "./config/db/prismaClient.js"; // Prisma client for DB access

dotenv.config(); // Initialize environment variables

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join Project Room (Group Chat)
  socket.on("join_project", (projectId) => {
    socket.join(`project_${projectId}`);
    console.log(`User ${socket.id} joined project room: project_${projectId}`);
  });

  // Handle Group Message
  socket.on("send_group_message", async (data) => {

    try {
      const { chatId, content, senderId, projectId, metadata } = data;

      // Save to DB
      const newMessage = await prisma.group_message.create({
        data: {
          group_chat_id: chatId,
          content,
          sender_id: senderId,
          metadata: metadata || undefined,
        }
      });

      // Update group_chat attachments if present in metadata
      if (metadata?.attachments && Array.isArray(metadata.attachments) && metadata.attachments.length > 0) {
        try {
          const chat = await prisma.group_chat.findUnique({ where: { id: chatId } });
          if (chat) {
            let currentAttachments = chat.attachments || [];
            if (!Array.isArray(currentAttachments)) currentAttachments = [];

            const newAttachments = [...currentAttachments, ...metadata.attachments];

            await prisma.group_chat.update({
              where: { id: chatId },
              data: { attachments: newAttachments }
            });
          }
        } catch (attachErr) {
          console.error("Failed to update group_chat attachments:", attachErr);
          // Don't fail the message send if attachment tracking fails, just log it
        }
      }

      // Fetch sender details manually (schema relation is missing)
      const sender = await prisma.app_user.findUnique({
        where: { id: senderId },
        select: {
          id: true,
          username: true,
          display_name: true,
          profile_pic_url: true,
        }
      });

      const enrichedMessage = {
        ...newMessage,
        sender: sender || null
      };

      // Broadcast to room
      io.to(`project_${projectId}`).emit("receive_group_message", enrichedMessage);

    } catch (err) {
      console.error("Socket message error:", err);
      socket.emit("error", "Failed to send message");
    }
  });

  // Handle Message Deletion
  socket.on("delete_group_message", (data) => {
    // data: { chatId, messageId, projectId }
    const { projectId, messageId } = data;
    io.to(`project_${projectId}`).emit("receive_delete_message", messageId);
  });

  // Handle Message Update (Soft Delete or Edit)
  socket.on("update_group_message", (data) => {
    const { projectId, message } = data;
    io.to(`project_${projectId}`).emit("receive_message_update", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ----- Initialize Server & Database -----
async function init() {
  try {
    await prisma.$connect(); // Connect DB
    console.log("✅ Database connected successfully");

    const startServer = () => {
      server.listen(PORT, () => {
        console.log(
          `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
        );
      });

      server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
          console.log('⚠️  Port 5000 is busy, retrying in 1 second...');
          setTimeout(() => {
            server.close();
            server.listen(PORT);
          }, 1000);
        } else {
          console.error("Server error:", e);
        }
      });
    };

    startServer();

  } catch (err) {
    console.error("❌ Database connection failed:", err.message); // Log DB connection errors
    process.exit(1); // Exit process with error code
  }
}


// ----- Graceful Shutdown -----
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down safely...`);

  // 1. Close HTTP Server (stops accepting new connections)
  server.close(() => {
    console.log("🛑 HTTP server closed.");
  });

  // 2. Disconnect Database
  try {
    await prisma.$disconnect();
    console.log("🛑 Prisma disconnected.");
  } catch (err) {
    console.error("Error during Prisma disconnect", err);
  }

  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

init();

