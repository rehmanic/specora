import prisma from "../../../../config/db/prismaClient.js";
import AppError from "../../../utils/AppError.js";

/**
 * Get or create a group chat for a project.
 */
export async function getOrCreateGroupChat(projectId) {
  // Resolve Project ID (Handle Slug vs UUID)
  let realProjectId = projectId;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

  if (!isUuid) {
    const project = await prisma.project.findUnique({
      where: { slug: projectId },
    });
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    realProjectId = project.id;
  }

  // Check if chat exists
  let chat = await prisma.group_chat.findFirst({
    where: { project_id: realProjectId },
  });

  // If not, create it
  if (!chat) {
    chat = await prisma.group_chat.create({
      data: { project_id: realProjectId },
    });
  }

  return chat;
}

/**
 * Get paginated group messages with sender info.
 */
export async function getMessages(chatId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;

  const messages = await prisma.group_message.findMany({
    where: { group_chat_id: chatId },
    skip: parseInt(skip),
    take: parseInt(limit),
    orderBy: { created_at: "asc" },
  });

  // Manual join to get sender details (since no schema relation)
  const senderIds = [...new Set(messages.map((m) => m.sender_id))];

  const users = await prisma.app_user.findMany({
    where: { id: { in: senderIds } },
    select: {
      id: true,
      username: true,
      display_name: true,
      profile_pic_url: true,
    },
  });

  const userMap = new Map(users.map((u) => [u.id, u]));

  return messages.map((msg) => ({
    ...msg,
    sender: userMap.get(msg.sender_id) || null,
  }));
}

/**
 * Save a group message and track attachments.
 */
export async function saveMessage(chatId, { content, senderId, metadata }) {
  const message = await prisma.group_message.create({
    data: {
      group_chat_id: chatId,
      content,
      sender_id: senderId,
      metadata: metadata || undefined,
    },
  });

  // Update group_chat attachments if present
  if (metadata?.attachments && Array.isArray(metadata.attachments) && metadata.attachments.length > 0) {
    try {
      const chat = await prisma.group_chat.findUnique({ where: { id: chatId } });
      if (chat) {
        let currentAttachments = chat.attachments || [];
        if (!Array.isArray(currentAttachments)) currentAttachments = [];

        const newAttachments = [...currentAttachments, ...metadata.attachments];

        await prisma.group_chat.update({
          where: { id: chatId },
          data: { attachments: newAttachments },
        });
      }
    } catch (attachErr) {
      console.error("Failed to update group_chat attachments via API:", attachErr);
    }
  }

  return message;
}

/**
 * Soft-delete a message (ownership enforced).
 */
export async function deleteMessage(messageId, userId) {
  const message = await prisma.group_message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.sender_id !== userId) {
    throw new AppError("Not authorized to delete this message", 403);
  }

  const updatedMessage = await prisma.group_message.update({
    where: { id: messageId },
    data: {
      content: "This message was deleted",
      metadata: { is_deleted: true },
    },
  });

  // Fetch sender details manually to return consistent object
  const sender = await prisma.app_user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      display_name: true,
      profile_pic_url: true,
    },
  });

  return { ...updatedMessage, sender: sender || null };
}
