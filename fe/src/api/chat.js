import { api } from "./client";
import { CHAT } from "./endpoints";

export const getProjectGroupChat = (projectId) =>
  api.get(CHAT.BY_PROJECT(projectId));

export const getGroupMessages = (chatId) =>
  api.get(CHAT.MESSAGES(chatId));

export const deleteMessageRequest = (messageId) =>
  api.delete(CHAT.DELETE_MESSAGE(messageId));
