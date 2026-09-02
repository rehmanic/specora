import asyncHandler from "../../../utils/asyncHandler.js";
import * as specbotService from "../services/specbotService.js";

// ─── Chat CRUD ────────────────────────────────────────────

export const createSpecbotChat = asyncHandler(async (req, res) => {
    const chat = await specbotService.createChat(req.body.project_id, req.body.title);
    res.status(201).json({ message: "Specbot Chat created successfully", chat });
});

export const deleteSpecbotChat = asyncHandler(async (req, res) => {
    await specbotService.deleteChat(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Specbot Chat deleted successfully" });
});

export const getAllSpecbotChats = asyncHandler(async (req, res) => {
    const chats = await specbotService.getAllChats(req.query.projectId, req.user.userId);
    res.status(200).json({ message: "Specbot Chat fetched successfully", chats });
});

export const clearSpecbotMessages = asyncHandler(async (req, res) => {
    await specbotService.clearMessages(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Specbot Chat cleared successfully" });
});

export const updateSpecbotChat = asyncHandler(async (req, res) => {
    const chat = await specbotService.updateChat(req.params.chatId, req.body.title, req.user.userId);
    res.status(200).json({ message: "Specbot Chat updated successfully", chat });
});

// ─── Messages ─────────────────────────────────────────────

export const createMessage = asyncHandler(async (req, res) => {
    const result = await specbotService.createMessage(req.body);
    res.status(201).json({ message: "Message created successfully", data: result.userMessage, botMessage: result.botMessage });
});

export const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await specbotService.getAllMessages(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Messages fetched successfully", count: messages.length, messages });
});

// ─── Artifacts ────────────────────────────────────────────

export const downloadSpecbotChat = asyncHandler(async (req, res) => {
    const artifact = await specbotService.downloadChat(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Chat downloaded and stored on the server", artifact, downloaded: true });
});

export const summarizeSpecbotChat = asyncHandler(async (req, res) => {
    const result = await specbotService.summarizeChat(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Summary generated and stored", cycle_time: result.cycle_time, artifact: result });
});

export const extractRequirementsFromChat = asyncHandler(async (req, res) => {
    const result = await specbotService.extractRequirements(req.params.chatId, req.user.userId);
    res.status(200).json({ message: "Requirements extracted and stored", cycle_time: result.cycle_time, artifact: result });
});
