import prisma from "../../../config/db/prismaClient.js";

// Get or Create Group Chat for a Project
export const getProjectGroupChat = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Resolve Project ID (Handle Slug vs UUID)
        let realProjectId = projectId;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);

        if (!isUuid) {
            const project = await prisma.project.findUnique({
                where: { slug: projectId },
            });
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
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
                data: {
                    project_id: realProjectId,
                },
            });
        }

        res.status(200).json({
            message: "Group chat fetched successfully",
            chat,
        });
    } catch (error) {
        console.error("Error fetching group chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Group Messages with Pagination
export const getGroupMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;

        const messages = await prisma.group_message.findMany({
            where: { group_chat_id: chatId },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {
                created_at: "asc", // Oldest first for chat history usually
            },
        });

        // Manual join to get sender details (since no schema relation)
        const senderIds = [...new Set(messages.map(m => m.sender_id))];

        const users = await prisma.app_user.findMany({
            where: {
                id: { in: senderIds }
            },
            select: {
                id: true,
                username: true,
                display_name: true,
                profile_pic_url: true,
            }
        });

        const userMap = new Map(users.map(u => [u.id, u]));

        const enrichedMessages = messages.map(msg => ({
            ...msg,
            sender: userMap.get(msg.sender_id) || null
        }));

        res.status(200).json({
            message: "Group messages fetched successfully",
            messages: enrichedMessages,
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send Message (HTTP fallback or for persistence before socket emit)
export const saveGroupMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content, senderId, metadata } = req.body;

        const message = await prisma.group_message.create({
            data: {
                group_chat_id: chatId,
                content,
                sender_id: senderId,
                metadata: metadata || undefined,
            }
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
                        data: { attachments: newAttachments }
                    });
                }
            } catch (attachErr) {
                console.error("Failed to update group_chat attachments via API:", attachErr);
            }
        }

        res.status(201).json({
            message: "Message saved",
            data: message
        });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Delete Message
export const deleteGroupMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.userId; // Authenticated user

        // Check ownership
        const message = await prisma.group_message.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.sender_id !== userId) {
            // Check if user is manager?? For now strict ownership.
            return res.status(403).json({ message: "Not authorized to delete this message" });
        }

        const updatedMessage = await prisma.group_message.update({
            where: { id: messageId },
            data: {
                content: "This message was deleted",
                metadata: { is_deleted: true }
            }
        });

        // Fetch sender details manually to return consistent object
        const sender = await prisma.app_user.findUnique({
            where: { id: userId }, // The deleter is the sender (verified above)
            select: {
                id: true,
                username: true,
                display_name: true,
                profile_pic_url: true,
            }
        });

        const enrichedMessage = {
            ...updatedMessage,
            sender: sender || null
        };

        res.status(200).json({
            message: "Message deleted successfully",
            data: enrichedMessage
        });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
