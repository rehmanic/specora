import * as chatRepo from "../repositories/chatRepository.js";
import AppError from "../../../utils/AppError.js";
import { resolveProjectId } from "../../../utils/resolveProjectId.js";

/**
 * Get or create a group chat for a project.
 */
export async function getOrCreateGroupChat(projectId) {
  const resolvedId = await resolveProjectId(projectId);
  if (!resolvedId) {
    throw new AppError("Project not found", 404);
  }

  // Check if chat exists
  let chat = await chatRepo.findGroupChatByProjectId(resolvedId);

  if (!chat) {
    chat = await chatRepo.createGroupChat(resolvedId);
  }

  return chat;
}

/**
 * Get paginated group messages with sender info.
 */
export async function getMessages(chatId, { page = 1, limit = 50 } = {}) {
  const skip = (page - 1) * limit;

  const messages = await chatRepo.findMessagesByChatId(chatId, {
    skip: parseInt(skip),
    take: parseInt(limit),
    orderBy: { created_at: "asc" },
  });

  // Manual join to get sender details (since no schema relation)
  const senderIds = [...new Set(messages.map((m) => m.sender_id))];

  const users = await chatRepo.findUsersByIds(senderIds, {
      id: true,
      username: true,
      display_name: true,
      profile_pic_url: true,
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
  const message = await chatRepo.createMessage({
      group_chat_id: chatId,
      content,
      sender_id: senderId,
      metadata: metadata || undefined,
  });

  // Update group_chat attachments if present
  if (metadata?.attachments && Array.isArray(metadata.attachments) && metadata.attachments.length > 0) {
    try {
      const chat = await chatRepo.findGroupChatById(chatId);
      if (chat) {
        let currentAttachments = chat.attachments || [];
        if (!Array.isArray(currentAttachments)) currentAttachments = [];

        const newAttachments = [...currentAttachments, ...metadata.attachments];

        await chatRepo.updateGroupChatAttachments(chatId, newAttachments);
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
  const message = await chatRepo.findMessageById(messageId);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (message.sender_id !== userId) {
    throw new AppError("Not authorized to delete this message", 403);
  }

  const updatedMessage = await chatRepo.updateMessage(messageId, {
      content: "This message was deleted",
      metadata: { is_deleted: true },
  });

  const sender = await chatRepo.findUserById(userId, {
      id: true,
      username: true,
      display_name: true,
      profile_pic_url: true,
  });

  return { ...updatedMessage, sender: sender || null };
}
