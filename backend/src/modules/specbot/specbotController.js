import fs from "fs";
import path from "path";
import prisma from "../../../config/db/prismaClient.js";
import { generateGeminiResponse, clearChatSession } from "../../utils/gemini.js";

const ARTIFACT_ROOT = path.join(process.cwd(), "storage", "specbot");

const ensureDirectory = async (targetPath) => {
    await fs.promises.mkdir(targetPath, { recursive: true });
};

const buildArtifactPaths = (projectId, chatId) => {
    const projectFolder = `project-${projectId || "unassigned"}`;
    const chatFolder = `chat-${chatId}`;
    const base = path.join(ARTIFACT_ROOT, projectFolder, chatFolder);

    return {
        base,
        chat: path.join(base, "chat.json"),
        summary: path.join(base, "summary.json"),
        requirements: path.join(base, "requirements.json"),
    };
};

const fileExists = async (filePath) => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

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

        // Clear the cached Gemini chat session
        clearChatSession(chatId);

        res.status(200).json({ message: "Specbot Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting Specbot Chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllSpecbotChats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { projectId } = req.query;
        const role = req.user.role;

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" });
        }

        const whereClause = { project_id: projectId };
        // Clients can only see their own chats, managers/requirements engineers can see all for the project
        if (role === "client") {
            whereClause.user_id = userId;
        }
        const chats = await prisma.specbot_chats.findMany({
            where: whereClause,
            orderBy: {
                created_at: 'desc',
            },
            include: {
                projects: {
                    select: {
                        name: true,
                        slug: true
                    }
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true
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

        // 2. If chat_type is 'specbot', generate bot response with context
        if (chat_type === 'specbot') {
            const botContent = await generateGeminiResponse(chat_id, content, instructions || {});

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
        res
            .status(502)
            .json({
                message:
                    "Specbot ran into a problem generating a response. Please try again in a moment.",
            });
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





export const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        // Check Specbot Chat
        const specbotChat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
            select: {
                id: true,
                user_id: true,
                project_id: true
            }
        });

        if (specbotChat) {
            if (role === "client" && specbotChat.user_id !== userId) {
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

const extractBulletPoints = (text) =>
    text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-") || line.startsWith("*"))
        .map((line) => line.replace(/^[-*]\s*/, ""))
        .filter(Boolean);

const mapBulletPointsToRequirements = (points) =>
    points.map((point, idx) => ({
        id: `req-${idx + 1}`,
        title: point.slice(0, 80),
        description: point,
        priority: "medium",
    }));

/**
 * Strips markdown code block delimiters from LLM responses.
 * Handles formats like: ```json\n{...}\n``` or ```\n{...}\n```
 */
const stripMarkdownCodeBlock = (text) => {
    if (!text || typeof text !== "string") return text;

    // Trim whitespace first
    let cleaned = text.trim();

    // Check if it starts with ``` (with optional language identifier)
    const codeBlockStart = /^```(?:\w+)?\s*\n?/;
    const codeBlockEnd = /\n?```\s*$/;

    if (codeBlockStart.test(cleaned) && codeBlockEnd.test(cleaned)) {
        cleaned = cleaned.replace(codeBlockStart, "").replace(codeBlockEnd, "");
    }

    return cleaned.trim();
};

export const downloadSpecbotChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
            include: {
                projects: { select: { id: true, name: true, slug: true } },
                users: {
                    select: {
                        id: true,
                        username: true,
                        display_name: true,
                        role: true,
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (role === "client" && chat.user_id !== userId) {
            return res
                .status(403)
                .json({ message: "Access denied. You can only download your own chats." });
        }

        const messages = await prisma.messages.findMany({
            where: { chat_id: chatId },
            orderBy: { created_at: "asc" },
        });

        const artifactPaths = buildArtifactPaths(chat.project_id, chatId);
        await ensureDirectory(artifactPaths.base);

        const exportedAt = new Date().toISOString();
        const payload = {
            chat,
            project: chat.projects,
            owner: chat.users,
            messages,
            exported_at: exportedAt,
        };

        await fs.promises.writeFile(
            artifactPaths.chat,
            JSON.stringify(payload, null, 2),
            "utf8"
        );

        res.status(200).json({
            message: "Chat downloaded and stored on the server",
            artifact: {
                type: "chat",
                path: artifactPaths.chat,
                exported_at: exportedAt,
            },
            downloaded: true,
        });
    } catch (error) {
        console.error("Error downloading Specbot chat:", error);
        res.status(500).json({
            message: "Unable to store the chat right now. Please try again later.",
        });
    }
};

export const summarizeSpecbotChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
            select: {
                id: true,
                user_id: true,
                project_id: true,
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (role === "client" && chat.user_id !== userId) {
            return res
                .status(403)
                .json({ message: "Access denied. You can only summarize your own chats." });
        }

        const artifactPaths = buildArtifactPaths(chat.project_id, chatId);
        if (!(await fileExists(artifactPaths.chat))) {
            return res.status(400).json({
                message: "Please download the chat before summarizing.",
            });
        }

        const storedChatRaw = await fs.promises.readFile(artifactPaths.chat, "utf8");
        const storedChat = JSON.parse(storedChatRaw);
        const transcript = storedChat.messages
            .map(
                (msg) =>
                    `${msg.sender_type === "bot" ? "BOT" : "USER"}: ${msg.content}`
            )
            .join("\n");

        const instructions = {
            task: "summarize_chat",
            expectations:
                "Return a concise summary focused on requirements, risks, and open questions.",
            output: "JSON or text is fine; concise paragraphs preferred.",
        };

        const summaryText = await generateGeminiResponse(
            chatId,
            transcript,
            instructions
        );

        const summaryPayload = {
            chat_id: chatId,
            project_id: chat.project_id,
            generated_at: new Date().toISOString(),
            summary_text: summaryText,
            key_points: extractBulletPoints(summaryText),
        };

        await fs.promises.writeFile(
            artifactPaths.summary,
            JSON.stringify(summaryPayload, null, 2),
            "utf8"
        );

        res.status(200).json({
            message: "Summary generated and stored",
            artifact: {
                type: "summary",
                path: artifactPaths.summary,
                data: summaryPayload,
            },
        });
    } catch (error) {
        console.error("Error summarizing Specbot chat:", error);
        res.status(502).json({
            message:
                "Unable to summarize this chat right now. Please try again shortly.",
        });
    }
};

export const extractRequirementsFromChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        const chat = await prisma.specbot_chats.findUnique({
            where: { id: chatId },
            select: {
                id: true,
                user_id: true,
                project_id: true,
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        if (role === "client" && chat.user_id !== userId) {
            return res.status(403).json({
                message: "Access denied. You can only extract requirements for your own chats.",
            });
        }

        const artifactPaths = buildArtifactPaths(chat.project_id, chatId);
        if (!(await fileExists(artifactPaths.chat))) {
            return res.status(400).json({
                message: "Please download the chat before extracting requirements.",
            });
        }

        const storedChatRaw = await fs.promises.readFile(artifactPaths.chat, "utf8");
        const storedChat = JSON.parse(storedChatRaw);
        const transcript = storedChat.messages
            .map(
                (msg) =>
                    `${msg.sender_type === "bot" ? "BOT" : "USER"}: ${msg.content}`
            )
            .join("\n");

        const instructions = {
            task: "extract_requirements",
            expectations:
                "Return actionable functional/non-functional requirements only. Ignore chit-chat.",
            output:
                "Prefer JSON { requirements: [{title, description, priority, acceptance_criteria}] }",
        };

        const requirementsText = await generateGeminiResponse(
            chatId,
            transcript,
            instructions
        );

        const requirementsPayload = {
            chat_id: chatId,
            project_id: chat.project_id,
            generated_at: new Date().toISOString(),
            requirements: [],
            raw: requirementsText,
        };

        try {
            const cleanedText = stripMarkdownCodeBlock(requirementsText);
            const parsed = JSON.parse(cleanedText);
            if (Array.isArray(parsed)) {
                requirementsPayload.requirements = parsed;
            } else if (Array.isArray(parsed.requirements)) {
                requirementsPayload.requirements = parsed.requirements;
            }
        } catch {
            const points = extractBulletPoints(requirementsText);
            requirementsPayload.requirements = mapBulletPointsToRequirements(points);
        }

        await fs.promises.writeFile(
            artifactPaths.requirements,
            JSON.stringify(requirementsPayload, null, 2),
            "utf8"
        );

        res.status(200).json({
            message: "Requirements extracted and stored",
            artifact: {
                type: "requirements",
                path: artifactPaths.requirements,
                data: requirementsPayload,
            },
        });
    } catch (error) {
        console.error("Error extracting requirements from Specbot chat:", error);
        res.status(502).json({
            message:
                "Unable to extract requirements right now. Please try again in a bit.",
        });
    }
};
