import prisma from "../../../../config/db/prismaClient.js";

// ─── Group Chat ───────────────────────────────────────────

export async function findGroupChatByProjectId(projectId) {
    return await prisma.group_chat.findFirst({
        where: { project_id: projectId },
    });
}

export async function createGroupChat(projectId) {
    return await prisma.group_chat.create({
        data: { project_id: projectId },
    });
}

export async function findGroupChatById(chatId) {
    return await prisma.group_chat.findUnique({
        where: { id: chatId },
    });
}

export async function updateGroupChatAttachments(chatId, newAttachments) {
    return await prisma.group_chat.update({
        where: { id: chatId },
        data: { attachments: newAttachments },
    });
}

// ─── Group Messages ───────────────────────────────────────

export async function findMessagesByChatId(chatId, options = {}) {
    return await prisma.group_message.findMany({
        where: { group_chat_id: chatId },
        skip: options.skip,
        take: options.take,
        orderBy: options.orderBy,
    });
}

export async function createMessage(data) {
    return await prisma.group_message.create({
        data,
    });
}

export async function findMessageById(messageId) {
    return await prisma.group_message.findUnique({
        where: { id: messageId },
    });
}

export async function updateMessage(messageId, data) {
    return await prisma.group_message.update({
        where: { id: messageId },
        data,
    });
}

// ─── Users (For Chat Participants) ────────────────────────

export async function findUsersByIds(userIds, select) {
    return await prisma.app_user.findMany({
        where: { id: { in: userIds } },
        select: select || undefined,
    });
}

export async function findUserById(userId, select) {
    return await prisma.app_user.findUnique({
        where: { id: userId },
        select: select || undefined,
    });
}
