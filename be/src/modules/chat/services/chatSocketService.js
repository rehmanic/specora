import * as chatService from "./chatService.js";
import * as chatRepo from "../repositories/chatRepository.js";

/**
 * Register Chat Socket listeners on the Socket.IO instance.
 * @param {import("socket.io").Server} io
 */
export function registerChatSocketHandlers(io) {
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

        // Save message & update attachments via chatService
        const newMessage = await chatService.saveMessage(chatId, {
          content,
          senderId,
          metadata,
        });

        // Fetch sender details manually for enrichment
        const sender = await chatRepo.findUserById(senderId, {
          id: true,
          username: true,
          display_name: true,
          profile_pic_url: true,
        });

        const enrichedMessage = {
          ...newMessage,
          sender: sender || null,
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
}
