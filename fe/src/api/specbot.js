import { api } from "./client";
import { SPECBOT } from "./endpoints";

const AI_TIMEOUT = { timeout: 60_000 };

// ======================
// Chat CRUD
// ======================
export const createSpecbotChat = (chatData) =>
  api.post(SPECBOT.CHAT_CREATE, chatData);

export const deleteSpecbotChat = (chatId) =>
  api.delete(SPECBOT.CHAT_DELETE(chatId));

export const clearSpecbotChat = (chatId) =>
  api.delete(SPECBOT.CHAT_CLEAR(chatId));

export function getAllSpecbotChats(projectId) {
  let endpoint = SPECBOT.CHAT_ALL;
  if (projectId) {
    endpoint += `?projectId=${encodeURIComponent(projectId)}`;
  }
  return api.get(endpoint, { cache: "no-store" });
}

export const updateSpecbotChat = (chatId, updateData) =>
  api.put(SPECBOT.CHAT_UPDATE(chatId), updateData);

// ======================
// Messages
// ======================
export const createMessage = (messageData) =>
  api.post(SPECBOT.MESSAGE_CREATE, messageData);

export const getAllMessages = (chatId) =>
  api.get(SPECBOT.MESSAGES_ALL(chatId), { cache: "no-store" });

// ======================
// AI-powered (longer timeout)
// ======================
export const downloadSpecbotChat = (chatId) =>
  api.post(SPECBOT.CHAT_DOWNLOAD(chatId), undefined, AI_TIMEOUT);

export const summarizeSpecbotChat = (chatId) =>
  api.post(SPECBOT.CHAT_SUMMARIZE(chatId), undefined, AI_TIMEOUT);

export const extractSpecbotRequirements = (chatId) =>
  api.post(SPECBOT.CHAT_EXTRACT(chatId), undefined, AI_TIMEOUT);
