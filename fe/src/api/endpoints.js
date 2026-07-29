/**
 * Centralized endpoint constants.
 *
 * Dynamic path segments use factory functions that automatically apply
 * encodeURIComponent, preventing URL-injection issues.
 *
 * Usage:
 *   import { USERS } from "./endpoints";
 *   api.get(USERS.ALL);
 *   api.get(USERS.SINGLE("john"));
 */

const e = encodeURIComponent;

// ─── Auth ────────────────────────────────────────────────────────────────────

export const AUTH = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const USERS = {
  CREATE: "/users/create",
  ALL: "/users/all",
  BY_IDS: "/users/ids",
  SINGLE: (username) => `/users/${e(username)}`,
};

// ─── Projects ────────────────────────────────────────────────────────────────

export const PROJECTS = {
  ALL: "/projects/all",
  CREATE: "/projects/",
  BY_USER: (userId) => `/projects/${e(userId)}`,
  SINGLE: (projectId) => `/projects/${e(projectId)}`,
  // Members
  MEMBERS: (projectId) => `/projects/${e(projectId)}/members`,
  MEMBER: (projectId, memberId) => `/projects/${e(projectId)}/members/${e(memberId)}`,
  // Tags
  TAGS: (projectId) => `/projects/${e(projectId)}/tags`,
  TAG: (projectId, tag) => `/projects/${e(projectId)}/tags/${e(tag)}`,
};

// ─── Feedback ────────────────────────────────────────────────────────────────

export const FEEDBACKS = {
  BY_PROJECT: (projectId) => `/feedbacks/project/${e(projectId)}`,
  CREATE: "/feedbacks",
  SINGLE: (feedbackId) => `/feedbacks/${e(feedbackId)}`,
  RESPONSES: (feedbackId) => `/feedbacks/${e(feedbackId)}/responses`,
  MY_RESPONSE: (feedbackId) => `/feedbacks/${e(feedbackId)}/my-response`,
  DELETE_RESPONSE: (responseId) => `/feedbacks/responses/${e(responseId)}`,
};

// ─── Specbot ─────────────────────────────────────────────────────────────────

export const SPECBOT = {
  CHAT_CREATE: "/specbot/chat/create",
  CHAT_ALL: "/specbot/chat/all",
  CHAT_UPDATE: (chatId) => `/specbot/chat/update/${e(chatId)}`,
  CHAT_DELETE: (chatId) => `/specbot/chat/delete/${e(chatId)}`,
  CHAT_CLEAR: (chatId) => `/specbot/chat/${e(chatId)}/clear`,
  CHAT_DOWNLOAD: (chatId) => `/specbot/chat/${e(chatId)}/download`,
  CHAT_SUMMARIZE: (chatId) => `/specbot/chat/${e(chatId)}/summarize`,
  CHAT_EXTRACT: (chatId) => `/specbot/chat/${e(chatId)}/extract`,
  MESSAGE_CREATE: "/specbot/message/create",
  MESSAGES_ALL: (chatId) => `/specbot/messages/all/${e(chatId)}`,
};

// ─── Chat (Group / Project) ─────────────────────────────────────────────────

export const CHAT = {
  BY_PROJECT: (projectId) => `/chat/project/${e(projectId)}`,
  MESSAGES: (chatId) => `/chat/${e(chatId)}/messages`,
  DELETE_MESSAGE: (messageId) => `/chat/message/${e(messageId)}`,
};

// ─── Diagrams ────────────────────────────────────────────────────────────────

export const DIAGRAMS = {
  BY_PROJECT: (projectId) => `/diagrams/${e(projectId)}`,
  SINGLE: (projectId, diagramId) => `/diagrams/${e(projectId)}/${e(diagramId)}`,
  GENERATE: (projectId) => `/diagrams/${e(projectId)}/generate`,
  EDIT: (projectId) => `/diagrams/${e(projectId)}/edit`,
  REQUIREMENTS: (projectId, diagramId) =>
    `/diagrams/${e(projectId)}/${e(diagramId)}/requirements`,
};

// ─── Docs ────────────────────────────────────────────────────────────────────

export const DOCS = {
  BY_PROJECT: (projectId) => `/docs/${e(projectId)}`,
  SINGLE: (projectId, docId) => `/docs/${e(projectId)}/${e(docId)}`,
  REQUIREMENTS: (projectId, docId) =>
    `/docs/${e(projectId)}/${e(docId)}/requirements`,
  GENERATE: (projectId, docId) =>
    `/docs/${e(projectId)}/${e(docId)}/generate`,
  EDIT_WITH_AI: (projectId, docId) =>
    `/docs/${e(projectId)}/${e(docId)}/edit-with-ai`,
  EXPORT: (projectId, docId, format) =>
    `/docs/${e(projectId)}/${e(docId)}/export/${e(format)}`,
};

// ─── Meetings ────────────────────────────────────────────────────────────────

export const MEETINGS = {
  CREATE: "/meetings/create",
  BY_PROJECT: (projectId) => `/meetings/project/${e(projectId)}`,
  SINGLE: (meetingId) => `/meetings/${e(meetingId)}`,
  JOIN: (meetingId) => `/meetings/${e(meetingId)}/join`,
  UPLOAD_RECORDING: (meetingId) => `/meetings/${e(meetingId)}/upload-recording`,
  TRANSCRIBE: (meetingId) => `/meetings/${e(meetingId)}/transcribe`,
  EXTRACT_REQUIREMENTS: (meetingId) =>
    `/meetings/${e(meetingId)}/extract-requirements`,
};

// ─── RBAC ────────────────────────────────────────────────────────────────────

export const RBAC = {
  ROLES: "/rbac/roles",
  ROLE: (id) => `/rbac/roles/${e(id)}`,
  ROLE_PERMISSIONS: (roleId) => `/rbac/roles/${e(roleId)}/permissions`,
  ROLE_PERMISSION: (roleId, permissionId) =>
    `/rbac/roles/${e(roleId)}/permissions/${e(permissionId)}`,
  PERMISSIONS: "/rbac/permissions",
  PERMISSION: (id) => `/rbac/permissions/${e(id)}`,
};

// ─── Requirements ────────────────────────────────────────────────────────────

export const REQUIREMENTS = {
  BY_PROJECT: (projectId) => `/requirements/${e(projectId)}`,
  SINGLE: (projectId, reqId) => `/requirements/${e(projectId)}/${e(reqId)}`,
  HISTORY: (projectId, reqId) =>
    `/requirements/${e(projectId)}/${e(reqId)}/history`,
  ROLLBACK: (projectId, reqId, historyId) =>
    `/requirements/${e(projectId)}/${e(reqId)}/rollback/${e(historyId)}`,
  COMMENTS: (projectId, reqId) =>
    `/requirements/${e(projectId)}/${e(reqId)}/comments`,
  TRACEABILITY: (projectId, reqId) =>
    `/requirements/${e(projectId)}/${e(reqId)}/traceability`,
  TRACEABILITY_LINK: (projectId, linkId) =>
    `/requirements/${e(projectId)}/traceability/${e(linkId)}`,
  TRACEABILITY_GRAPH: (projectId) =>
    `/requirements/${e(projectId)}/traceability/graph`,
  IMPORT: (projectId) => `/requirements/${e(projectId)}/import`,
};

// ─── Verification ────────────────────────────────────────────────────────────

export const VERIFICATION = {
  ARM: (projectId) => `/verification/arm/${e(projectId)}`,
  AI: (projectId) => `/verification/ai/${e(projectId)}`,
  ARM_REQUIREMENT: (projectId, reqId) =>
    `/verification/arm/${e(projectId)}/requirement/${e(reqId)}`,
  AI_REQUIREMENT: (projectId, reqId) =>
    `/verification/ai/${e(projectId)}/requirement/${e(reqId)}`,
};

// ─── Prototyping ─────────────────────────────────────────────────────────────

export const PROTOTYPING = {
  PROTOTYPES: (projectId) => `/prototyping/prototypes/${e(projectId)}`,
  PROTOTYPE: (prototypeId) => `/prototyping/prototypes/${e(prototypeId)}`,
  SCREENS: (prototypeId) =>
    `/prototyping/prototypes/${e(prototypeId)}/screens`,
  SCREEN: (screenId) => `/prototyping/screens/${e(screenId)}`,
  REORDER_SCREENS: "/prototyping/screens/reorder",
  SCREEN_REQUIREMENTS: (screenId) =>
    `/prototyping/screens/${e(screenId)}/requirements`,
};

// ─── Upload ──────────────────────────────────────────────────────────────────

export const UPLOAD = {
  FILE: "/upload",
};
