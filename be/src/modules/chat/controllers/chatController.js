import asyncHandler from "../../../utils/asyncHandler.js";
import * as chatService from "../services/chatService.js";

// Get or Create Group Chat for a Project
export const getProjectGroupChat = asyncHandler(async (req, res) => {
    const chat = await chatService.getOrCreateGroupChat(req.params.projectId);

    res.status(200).json({
        message: "Group chat fetched successfully",
        chat,
    });
});

// Get Group Messages with Pagination
export const getGroupMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { page, limit } = req.query;

    const messages = await chatService.getMessages(chatId, { page, limit });

    res.status(200).json({
        message: "Group messages fetched successfully",
        messages,
    });
});

// Send Message (HTTP fallback or for persistence before socket emit)
export const saveGroupMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { content, senderId, metadata } = req.body;

    const message = await chatService.saveMessage(chatId, { content, senderId, metadata });

    res.status(201).json({
        message: "Message saved",
        data: message,
    });
});

// Delete Message
export const deleteGroupMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const enrichedMessage = await chatService.deleteMessage(messageId, userId);

    res.status(200).json({
        message: "Message deleted successfully",
        data: enrichedMessage,
    });
});
