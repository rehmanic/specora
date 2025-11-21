import prisma from "../../../config/db/prismaClient.js";

export const createSpecbotChat = async (req, res) => {
    try {
        const { title, user_id, project_id } = req.body;

        // Check if project exists
        const project = await prisma.projects.findUnique({
            where: { id: project_id },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user exists
        const user = await prisma.users.findUnique({
            where: { id: user_id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create Specbot Chat
        const newChat = await prisma.specbot_chats.create({
            data: {
                title,
                user_id,
                project_id,
            },
        });

        res.status(201).json({
            message: "Specbot Chat created successfully",
            chat: newChat,
        });
    } catch (error) {
        console.error("Error creating Specbot Chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteSpecbotChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;

        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (chat.user_id !== userId) {
            return res.status(403).json({ message: "Access denied. You can only delete your own chats." });
        }

        await prisma.$transaction([
            prisma.messages.deleteMany({
                where: { chat_id: chatId },
            }),
            prisma.specbot_chats.delete({
                where: { id: chatId },
            }),
        ]);

        res.status(200).json({ message: "Specbot Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting Specbot Chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllSpecbotChats = async (req, res) => {
    try {
        const userId = req.user.userId;

        const chats = await prisma.specbot_chats.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                projects: {
                    select: {
                        name: true,
                        slug: true
                    }
                }
            }
        });

        res.status(200).json({
            message: "Specbot Chats fetched successfully",
            count: chats.length,
            chats,
        });
    } catch (error) {
        console.error("Error fetching Specbot Chats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSpecbotChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { title } = req.body;
        const userId = req.user.userId;

        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (chat.user_id !== userId) {
            return res.status(403).json({ message: "Access denied. You can only update your own chats." });
        }

        const updatedChat = await prisma.specbot_chats.update({
            where: { id: chatId },
            data: {
                title,
                updated_at: new Date(),
            },
        });

        res.status(200).json({
            message: "Specbot Chat updated successfully",
            chat: updatedChat,
        });
    } catch (error) {
        console.error("Error updating Specbot Chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { chat_type, chat_id, content, sender_type, sender_id, instructions } = req.body;

        // 1. Create User Message
        const userMessage = await createMessageCore({
            chat_type,
            chat_id,
            content,
            sender_type,
            sender_id,
        });

        let botMessage = null;

        // 2. If chat_type is 'specbot', generate bot response
        if (chat_type === 'specbot') {
            const botContent = await generateGeminiResponse(content, instructions || {});

            botMessage = await createMessageCore({
                chat_type,
                chat_id,
                content: botContent,
                sender_type: 'bot',
                sender_id: null
            });
        }

        res.status(201).json({
            message: "Message created successfully",
            data: userMessage,
            botMessage
        });
    } catch (error) {
        console.error("Error creating message:", error);
        if (error.message.includes("not found")) {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
};

// Helper function for creating messages
const createMessageCore = async ({ chat_type, chat_id, content, sender_type, sender_id }) => {
    // Verify chat exists based on type
    if (chat_type === 'specbot') {
        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chat_id },
        });
        if (!chat) {
            throw new Error("Specbot chat not found");
        }
    } else if (chat_type === 'group') {
        const chat = await prisma.group_chats.findUnique({
            where: { id: chat_id },
        });
        if (!chat) {
            throw new Error("Group chat not found");
        }
    }

    // Verify sender exists if it's a user
    if (sender_type === 'user') {
        const user = await prisma.users.findUnique({
            where: { id: sender_id },
        });
        if (!user) {
            throw new Error("Sender (User) not found");
        }
    }

    return await prisma.messages.create({
        data: {
            chat_type,
            chat_id,
            content,
            sender_type,
            sender_id,
        },
    });
};

import { generateGeminiResponse } from "../../utils/gemini.js";



export const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;

        // Check Specbot Chat
        const specbotChat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
        });

        if (specbotChat) {
            if (specbotChat.user_id !== userId) {
                return res.status(403).json({ message: "Access denied. You can only view your own chats." });
            }
        }

        if (!specbotChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const messages = await prisma.messages.findMany({
            where: { chat_id: chatId },
            orderBy: { created_at: 'asc' },
            include: {
                users: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        profile_pic_url: true
                    }
                }
            }
        });

        res.status(200).json({
            message: "Messages fetched successfully",
            count: messages.length,
            messages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
