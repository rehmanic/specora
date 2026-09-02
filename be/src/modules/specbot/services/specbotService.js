import fs from "fs";
import path from "path";
import * as specbotRepo from "../repositories/specbotRepository.js";
import AppError from "../../../utils/AppError.js";
import { generateGeminiResponse, generateStatelessResponse, clearChatSession } from "../../../utils/gemini.js";
import { storageService } from "../../../lib/storage/index.js";

const ARTIFACT_ROOT = storageService.getDomainPath("specbot");

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

const stripMarkdownCodeBlock = (text) => {
    if (!text || typeof text !== "string") return text;
    let cleaned = text.trim();
    const codeBlockStart = /^```(?:\w+)?\s*\n?/;
    const codeBlockEnd = /\n?```\s*$/;
    if (codeBlockStart.test(cleaned) && codeBlockEnd.test(cleaned)) {
        cleaned = cleaned.replace(codeBlockStart, "").replace(codeBlockEnd, "");
        return cleaned.trim();
    }
    const jsonBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) return jsonBlockMatch[1].trim();
    const jsonObjectMatch = cleaned.match(/(\{[\s\S]*\})/);
    if (jsonObjectMatch && jsonObjectMatch[1]) {
        try {
            JSON.parse(jsonObjectMatch[1]);
            return jsonObjectMatch[1];
        } catch {}
    }
    return cleaned.trim();
};

export async function checkAccess(chatId, userId) {
    const chat = await specbotRepo.findChatById(chatId);
    if (!chat) throw new AppError("Chat not found", 404);
    const isCreator = chat.project.created_by === userId;
    const isMember = chat.project.project_member.length > 0;
    if (!isCreator && !isMember) throw new AppError("Access denied", 403);
    return chat;
}

export async function createChat(projectId, title) {
    const project = await specbotRepo.findProjectById(projectId);
    if (!project) throw new AppError("Project not found", 404);
    return await specbotRepo.createChat(projectId, title);
}

export async function deleteChat(chatId, userId) {
    await checkAccess(chatId, userId);
    await specbotRepo.deleteChat(chatId);
    clearChatSession(chatId);
}

export async function getAllChats(projectId, userId) {
    if (!projectId) throw new AppError("Project ID is required", 400);

    const project = await specbotRepo.findProjectWithMember(projectId, userId);

    if (!project) throw new AppError("Project not found", 404);

    const isCreator = project.created_by === userId;
    const isMember = project.project_member.length > 0;
    if (!isCreator && !isMember) throw new AppError("Access denied", 403);

    let chat = await specbotRepo.findDefaultChat(projectId);

    if (!chat) {
        chat = await specbotRepo.createChat(projectId, "Default Specbot Chat");
    }

    return [chat];
}

export async function clearMessages(chatId, userId) {
    await checkAccess(chatId, userId);
    await specbotRepo.deleteMessagesByChatId(chatId);
    clearChatSession(chatId);
}

export async function updateChat(chatId, title, userId) {
    await checkAccess(chatId, userId);
    return await specbotRepo.updateChat(chatId, title);
}

export async function createMessageCore(data) {
    const { chat_type, chat_id, content, sender_type, sender_id } = data;
    if (chat_type === 'specbot') {
        const chat = await specbotRepo.findChatById(chat_id);
        if (!chat) throw new AppError("Specbot chat not found", 404);
        await specbotRepo.updateChatTimestamp(chat_id);
        return await specbotRepo.createMessage({
            chat_id,
            content,
            sender_type,
            metadata: sender_type === 'user' ? { sender_id } : {}, 
            sender_id: sender_type === 'user' ? sender_id : null,
        });
    } else if (chat_type === 'group') {
        const chat = await specbotRepo.findGroupChatById(chat_id);
        if (!chat) throw new AppError("Group chat not found", 404);
        if (sender_type === 'user') {
            const user = await specbotRepo.findUserById(sender_id);
            if (!user) throw new AppError("Sender not found", 404);
        }
        return await specbotRepo.createGroupMessage({
            chat_id,
            content,
            metadata: sender_type === 'user' ? { sender_type, sender_id } : { sender_type },
        });
    }
    throw new AppError("Invalid chat_type", 400);
}

export async function createMessage(data) {
    const userMessage = await createMessageCore(data);
    let botMessage = null;
    if (data.chat_type === 'specbot') {
        const botContent = await generateGeminiResponse(data.chat_id, data.content, data.instructions || {});
        botMessage = await createMessageCore({
            ...data,
            content: botContent,
            sender_type: 'bot',
            sender_id: null
        });
    }
    return { userMessage, botMessage };
}

export async function getAllMessages(chatId, userId) {
    await checkAccess(chatId, userId);
    return await specbotRepo.findMessagesByChatId(chatId);
}

export async function downloadChat(chatId, userId) {
    const chat = await checkAccess(chatId, userId);
    const messages = await specbotRepo.findMessagesByChatId(chatId);

    const artifactPaths = buildArtifactPaths(chat.project_id, chatId);
    await ensureDirectory(artifactPaths.base);

    if (chat.last_downloaded_at && chat.updated_at && chat.last_downloaded_at >= chat.updated_at) {
        if (await fileExists(artifactPaths.chat)) {
            return { type: "chat", path: artifactPaths.chat, exported_at: chat.last_downloaded_at, downloaded: true };
        }
    }

    const exportedAt = new Date().toISOString();
    const payload = { chat, project: chat.project, owner: chat.project.app_user, messages, exported_at: exportedAt };
    await fs.promises.writeFile(artifactPaths.chat, JSON.stringify(payload, null, 2), "utf8");
    await specbotRepo.updateChatDownloadTimestamp(chatId);

    return { type: "chat", path: artifactPaths.chat, exported_at: exportedAt, downloaded: true };
}

export async function summarizeChat(chatId, userId) {
    const chat = await checkAccess(chatId, userId);
    const artifactPaths = buildArtifactPaths(chat.project_id, chatId);

    if (chat.last_summarized_at && chat.updated_at && chat.last_summarized_at >= chat.updated_at) {
        if (await fileExists(artifactPaths.summary)) {
            const raw = await fs.promises.readFile(artifactPaths.summary, "utf8");
            return { type: "summary", path: artifactPaths.summary, data: JSON.parse(raw), cycle_time: 0 };
        }
    }

    if (!(await fileExists(artifactPaths.chat))) throw new AppError("Please download the chat before summarizing.", 400);

    const storedChat = JSON.parse(await fs.promises.readFile(artifactPaths.chat, "utf8"));
    const transcript = storedChat.messages.map(msg => {
        const senderType = msg.sender_type || (msg.metadata?.sender_type || "user");
        return `${senderType === "bot" ? "BOT" : "USER"}: ${msg.content}`;
    }).join("\n");

    const startTime = Date.now();
    const summaryText = await generateStatelessResponse(transcript, {
        task: "summarize_chat",
        expectations: "Return a concise summary focused on requirements, risks, and open questions.",
        output: "JSON or text is fine; concise paragraphs preferred.",
    });
    const cycle_time = Date.now() - startTime;

    const payload = { chat_id: chatId, project_id: chat.project_id, generated_at: new Date().toISOString(), summary_text: summaryText, key_points: extractBulletPoints(summaryText), cycle_time };
    await fs.promises.writeFile(artifactPaths.summary, JSON.stringify(payload, null, 2), "utf8");
    await specbotRepo.updateChatSummaryTimestamp(chatId);

    return { type: "summary", path: artifactPaths.summary, data: payload, cycle_time };
}

export async function extractRequirements(chatId, userId) {
    const chat = await checkAccess(chatId, userId);
    const artifactPaths = buildArtifactPaths(chat.project_id, chatId);

    if (chat.last_extracted_at && chat.updated_at && chat.last_extracted_at >= chat.updated_at) {
        if (await fileExists(artifactPaths.requirements)) {
            const raw = await fs.promises.readFile(artifactPaths.requirements, "utf8");
            return { type: "requirements", path: artifactPaths.requirements, data: JSON.parse(raw), cycle_time: 0 };
        }
    }

    if (!(await fileExists(artifactPaths.chat))) throw new AppError("Please download the chat before extracting requirements.", 400);

    const storedChat = JSON.parse(await fs.promises.readFile(artifactPaths.chat, "utf8"));
    const transcript = storedChat.messages.map(msg => {
        const senderType = msg.sender_type || (msg.metadata?.sender_type || "user");
        return `${senderType === "bot" ? "BOT" : "USER"}: ${msg.content}`;
    }).join("\n");

    const startTime = Date.now();
    const requirementsText = await generateStatelessResponse(transcript, {
        task: "extract_requirements",
        expectations: "Analyze the conversation and extract distinct, actionable requirements.",
        output: `Return ONLY raw JSON object: {"requirements": [{"title": "...", "description": "...", "priority": "low|mid|high", "status": "draft", "tags": ["..."]}]}`
    });
    const cycle_time = Date.now() - startTime;

    const payload = { chat_id: chatId, project_id: chat.project_id, generated_at: new Date().toISOString(), requirements: [], raw: requirementsText, cycle_time };
    
    try {
        const parsed = JSON.parse(stripMarkdownCodeBlock(requirementsText));
        if (Array.isArray(parsed)) payload.requirements = parsed;
        else if (Array.isArray(parsed.requirements)) payload.requirements = parsed.requirements;
    } catch {
        payload.requirements = mapBulletPointsToRequirements(extractBulletPoints(requirementsText));
    }

    await fs.promises.writeFile(artifactPaths.requirements, JSON.stringify(payload, null, 2), "utf8");
    await specbotRepo.updateChatExtractionTimestamp(chatId);

    return { type: "requirements", path: artifactPaths.requirements, data: payload, cycle_time };
}
