import fs from "fs";
import path from "path";
import prisma from "../../../config/db/prismaClient.js";
import { generateGeminiResponse, generateStatelessResponse, clearChatSession } from "../../utils/gemini.js";

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
        const { title, project_id } = req.body;

        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: project_id },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Create Specbot Chat (no user_id in schema, only project_id)
        const newChat = await prisma.specbot_chat.create({
            data: {
                title,
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

        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        project_member: {
                            where: { member_id: userId },
                        },
                        app_user: true, // creator
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = chat.project.created_by === userId;
        const isMember = chat.project.project_member.length > 0;
        if (!isCreator && !isMember) {
            return res.status(403).json({ message: "Access denied. You can only delete chats in projects you're part of." });
        }

        await prisma.$transaction([
            prisma.specbot_message.deleteMany({
                where: { specbot_chat_id: chatId },
            }),
            prisma.specbot_chat.delete({
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

        // Check if user has access to this project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                project_member: {
                    where: { member_id: userId },
                },
            },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isCreator = project.created_by === userId;
        const isMember = project.project_member.length > 0;
        if (!isCreator && !isMember && role === "client") {
            return res.status(403).json({ message: "Access denied. You don't have access to this project." });
        }

        const chats = await prisma.specbot_chat.findMany({
            where: { project_id: projectId },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                project: {
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

        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        project_member: {
                            where: { member_id: userId },
                        },
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = chat.project.created_by === userId;
        const isMember = chat.project.project_member.length > 0;
        if (!isCreator && !isMember) {
            return res.status(403).json({ message: "Access denied. You can only update chats in projects you're part of." });
        }

        const updatedChat = await prisma.specbot_chat.update({
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
    // Verify chat exists based on type and create message in appropriate table
    if (chat_type === 'specbot') {
        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chat_id },
        });
        if (!chat) {
            throw new Error("Specbot chat not found");
        }

        // Create specbot message (metadata can store sender info if needed)
        return await prisma.specbot_message.create({
            data: {
                specbot_chat_id: chat_id,
                content,
                sender_type,
                metadata: sender_type === 'user' ? { sender_id } : {}, // Remove redundant data
            },
        });
    } else if (chat_type === 'group') {
        const chat = await prisma.group_chat.findUnique({
            where: { id: chat_id },
        });
        if (!chat) {
            throw new Error("Group chat not found");
        }

        // Verify sender exists if it's a user
        if (sender_type === 'user') {
            const user = await prisma.app_user.findUnique({
                where: { id: sender_id },
            });
            if (!user) {
                throw new Error("Sender (User) not found");
            }
        }

        // Create group message (metadata can store sender info if needed)
        return await prisma.group_message.create({
            data: {
                group_chat_id: chat_id,
                content,
                metadata: sender_type === 'user' ? { sender_type, sender_id } : { sender_type },
            },
        });
    } else {
        throw new Error("Invalid chat_type");
    }
};





export const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        // Check Specbot Chat
        const specbotChat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        project_member: {
                            where: { member_id: userId },
                        },
                    },
                },
            },
        });

        if (!specbotChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = specbotChat.project.created_by === userId;
        const isMember = specbotChat.project.project_member.length > 0;
        if (!isCreator && !isMember && role === "client") {
            return res.status(403).json({ message: "Access denied. You can only view chats in projects you're part of." });
        }

        const messages = await prisma.specbot_message.findMany({
            where: { specbot_chat_id: chatId },
            orderBy: { created_at: 'asc' },
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
 * Also extracts JSON from within text that may have prose before/after
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
        return cleaned.trim();
    }

    // Try to extract JSON from within the text (e.g., prose + ```json...``` + prose)
    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
        return jsonBlockMatch[1].trim();
    }

    // Try to find raw JSON object/array in the response
    const jsonObjectMatch = cleaned.match(/(\{[\s\S]*\})/);
    if (jsonObjectMatch && jsonObjectMatch[1]) {
        try {
            JSON.parse(jsonObjectMatch[1]);
            return jsonObjectMatch[1];
        } catch {
            // Not valid JSON, continue
        }
    }

    return cleaned.trim();
};

export const downloadSpecbotChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.userId;
        const role = req.user.role;

        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        app_user: {
                            select: {
                                id: true,
                                username: true,
                                display_name: true,
                            },
                        },
                        project_member: {
                            where: { member_id: userId },
                        },
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = chat.project.created_by === userId;
        const isMember = chat.project.project_member.length > 0;
        if (!isCreator && !isMember && role === "client") {
            return res
                .status(403)
                .json({ message: "Access denied. You can only download chats in projects you're part of." });
        }

        const messages = await prisma.specbot_message.findMany({
            where: { specbot_chat_id: chatId },
            orderBy: { created_at: "asc" },
        });

        const artifactPaths = buildArtifactPaths(chat.project_id, chatId);
        await ensureDirectory(artifactPaths.base);

        const exportedAt = new Date().toISOString();
        const payload = {
            chat,
            project: chat.project,
            owner: chat.project.app_user,
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

        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        project_member: {
                            where: { member_id: userId },
                        },
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = chat.project.created_by === userId;
        const isMember = chat.project.project_member.length > 0;
        if (!isCreator && !isMember && role === "client") {
            return res
                .status(403)
                .json({ message: "Access denied. You can only summarize chats in projects you're part of." });
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
                (msg) => {
                    const senderType = msg.sender_type || (msg.metadata?.sender_type || "user");
                    return `${senderType === "bot" ? "BOT" : "USER"}: ${msg.content}`;
                }
            )
            .join("\n");

        const instructions = {
            task: "summarize_chat",
            expectations:
                "Return a concise summary focused on requirements, risks, and open questions.",
            output: "JSON or text is fine; concise paragraphs preferred.",
        };

        const summaryText = await generateStatelessResponse(
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

        const chat = await prisma.specbot_chat.findUnique({
            where: { id: chatId },
            include: {
                project: {
                    include: {
                        project_member: {
                            where: { member_id: userId },
                        },
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Check access: user must be creator or project member
        const isCreator = chat.project.created_by === userId;
        const isMember = chat.project.project_member.length > 0;
        if (!isCreator && !isMember && role === "client") {
            return res.status(403).json({
                message: "Access denied. You can only extract requirements for chats in projects you're part of.",
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
                (msg) => {
                    const senderType = msg.sender_type || (msg.metadata?.sender_type || "user");
                    return `${senderType === "bot" ? "BOT" : "USER"}: ${msg.content}`;
                }
            )
            .join("\n");

        const instructions = {
            task: "extract_requirements",
            expectations:
                "Analyze the conversation and extract distinct, actionable functional and non-functional requirements. Ignore chit-chat and off-topic discussion. Consolidate similar points into cohesive requirements.",
            output: 
                `You MUST return ONLY a valid JSON object matching this exact structure:
{
  "requirements": [
    {
      "title": "Short, concise summary (string)",
      "description": "Detailed explanation of the requirement (string)",
      "priority": "low, mid, or high (string, derive from context or default to mid)",
      "status": "draft",
      "tags": ["Array of context tags, e.g., UI, Database, Security, API", "string"]
    }
  ]
}
Do NOT wrap the output in markdown code blocks. Return ONLY the raw JSON string.`
        };

        const requirementsText = await generateStatelessResponse(
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
            console.log("[extractRequirements] Cleaned text preview:", cleanedText.substring(0, 200));
            const parsed = JSON.parse(cleanedText);
            if (Array.isArray(parsed)) {
                requirementsPayload.requirements = parsed;
                console.log("[extractRequirements] Parsed as array with", parsed.length, "items");
            } else if (Array.isArray(parsed.requirements)) {
                requirementsPayload.requirements = parsed.requirements;
                console.log("[extractRequirements] Parsed requirements array with", parsed.requirements.length, "items");
            } else {
                console.log("[extractRequirements] Parsed JSON but no requirements array found:", Object.keys(parsed));
            }
        } catch (parseError) {
            console.log("[extractRequirements] JSON parse failed:", parseError.message);
            console.log("[extractRequirements] Raw text preview:", requirementsText.substring(0, 300));
            const points = extractBulletPoints(requirementsText);
            requirementsPayload.requirements = mapBulletPointsToRequirements(points);
            console.log("[extractRequirements] Fallback to bullet points:", points.length, "found");
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
