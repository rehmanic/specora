import prisma from "../../../config/db/prismaClient.js";

// ─── Specbot Chat CRUD ────────────────────────────────────

export async function findChatById(chatId) {
    return await prisma.specbot_chat.findUnique({
        where: { id: chatId },
        include: {
            project: {
                include: {
                    project_member: true,
                    app_user: true
                }
            }
        }
    });
}

export async function findProjectById(projectId) {
    return await prisma.project.findUnique({ where: { id: projectId } });
}

export async function findProjectWithMember(projectId, userId) {
    return await prisma.project.findUnique({
        where: { id: projectId },
        include: { project_member: { where: { member_id: userId } } },
    });
}

export async function findDefaultChat(projectId) {
    return await prisma.specbot_chat.findFirst({
        where: { project_id: projectId, title: "Default Specbot Chat" },
        include: { project: { select: { name: true, slug: true } } }
    });
}

export async function createChat(projectId, title) {
    return await prisma.specbot_chat.create({
        data: { title, project_id: projectId },
        include: { project: { select: { name: true, slug: true } } }
    });
}

export async function updateChat(chatId, title) {
    return await prisma.specbot_chat.update({
        where: { id: chatId },
        data: { title, updated_at: new Date() },
    });
}

export async function updateChatTimestamp(chatId) {
    return await prisma.specbot_chat.update({
        where: { id: chatId },
        data: { updated_at: new Date() }
    });
}

export async function updateChatDownloadTimestamp(chatId) {
    return await prisma.specbot_chat.update({
        where: { id: chatId },
        data: { last_downloaded_at: new Date() }
    });
}

export async function updateChatSummaryTimestamp(chatId) {
    return await prisma.specbot_chat.update({
        where: { id: chatId },
        data: { last_summarized_at: new Date() }
    });
}

export async function updateChatExtractionTimestamp(chatId) {
    return await prisma.specbot_chat.update({
        where: { id: chatId },
        data: { last_extracted_at: new Date() }
    });
}

export async function deleteChat(chatId) {
    return await prisma.$transaction([
        prisma.specbot_message.deleteMany({ where: { specbot_chat_id: chatId } }),
        prisma.specbot_chat.delete({ where: { id: chatId } }),
    ]);
}

// ─── Specbot Messages ─────────────────────────────────────

export async function findMessagesByChatId(chatId) {
    return await prisma.specbot_message.findMany({
        where: { specbot_chat_id: chatId },
        orderBy: { created_at: "asc" },
        include: { sender: { select: { id: true, username: true, display_name: true, profile_pic_url: true } } },
    });
}

export async function createMessage(data) {
    return await prisma.specbot_message.create({
        data: {
            specbot_chat_id: data.chat_id,
            content: data.content,
            sender_type: data.sender_type,
            metadata: data.metadata,
            sender_id: data.sender_id,
        },
        include: { sender: { select: { id: true, username: true, display_name: true, profile_pic_url: true } } },
    });
}

export async function deleteMessagesByChatId(chatId) {
    return await prisma.specbot_message.deleteMany({ where: { specbot_chat_id: chatId } });
}

// ─── Group Chat ───────────────────────────────────────────

export async function findGroupChatById(chatId) {
    return await prisma.group_chat.findUnique({ where: { id: chatId } });
}

export async function findUserById(userId) {
    return await prisma.app_user.findUnique({ where: { id: userId } });
}

export async function createGroupMessage(data) {
    return await prisma.group_message.create({
        data: {
            group_chat_id: data.chat_id,
            content: data.content,
            metadata: data.metadata,
        },
    });
}
