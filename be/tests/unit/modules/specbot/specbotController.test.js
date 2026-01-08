/**
 * Specbot Controller Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createSpecbotChat,
    deleteSpecbotChat,
    getAllSpecbotChats,
    updateSpecbotChat,
    createMessage,
    getAllMessages,
    downloadSpecbotChat,
    summarizeSpecbotChat,
    extractRequirementsFromChat,
} from '../../../../src/modules/specbot/specbotController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { generateGeminiResponse, generateStatelessResponse, clearChatSession } from '../../../../src/utils/gemini.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Specbot Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createSpecbotChat', () => {
        it('should create a new chat when project and user exist', async () => {
            const mockProject = { id: 'proj-123', name: 'Test Project' };
            const mockUser = { id: 'user-123', username: 'testuser' };
            const mockChat = { id: 'chat-123', title: 'New Chat', user_id: 'user-123', project_id: 'proj-123' };

            prisma.projects.findUnique.mockResolvedValue(mockProject);
            prisma.users.findUnique.mockResolvedValue(mockUser);
            prisma.specbot_chats.create.mockResolvedValue(mockChat);

            const req = createMockRequest({
                body: { title: 'New Chat', user_id: 'user-123', project_id: 'proj-123' },
            });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe('Specbot Chat created successfully');
            expect(res.jsonData.chat).toEqual(mockChat);
        });

        it('should return 404 when project not found', async () => {
            prisma.projects.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                body: { title: 'New Chat', user_id: 'user-123', project_id: 'proj-123' },
            });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Project not found');
        });

        it('should return 404 when user not found', async () => {
            prisma.projects.findUnique.mockResolvedValue({ id: 'proj-123' });
            prisma.users.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                body: { title: 'New Chat', user_id: 'user-123', project_id: 'proj-123' },
            });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('User not found');
        });

        it('should return 500 on error', async () => {
            prisma.projects.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                body: { title: 'New Chat', user_id: 'user-123', project_id: 'proj-123' },
            });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteSpecbotChat', () => {
        it('should delete chat successfully when owner', async () => {
            const mockChat = { id: 'chat-123', user_id: 'user-123' };
            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);
            prisma.$transaction.mockResolvedValue([{}, {}]);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(clearChatSession).toHaveBeenCalledWith('chat-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when not owner', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({ id: 'chat-123', user_id: 'other-user' });

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 500 on error', async () => {
            prisma.specbot_chats.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllSpecbotChats', () => {
        it('should return all chats for project (manager role)', async () => {
            const mockChats = [
                { id: 'chat-1', title: 'Chat 1' },
                { id: 'chat-2', title: 'Chat 2' },
            ];
            prisma.specbot_chats.findMany.mockResolvedValue(mockChats);

            const req = createMockRequest({
                query: { projectId: 'proj-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
        });

        it('should return only own chats for client role', async () => {
            prisma.specbot_chats.findMany.mockResolvedValue([{ id: 'chat-1' }]);

            const req = createMockRequest({
                query: { projectId: 'proj-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(prisma.specbot_chats.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({ user_id: 'user-123' }),
                })
            );
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 400 when projectId missing', async () => {
            const req = createMockRequest({
                query: {},
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on error', async () => {
            prisma.specbot_chats.findMany.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                query: { projectId: 'proj-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateSpecbotChat', () => {
        it('should update chat title when owner', async () => {
            const mockChat = { id: 'chat-123', user_id: 'user-123', title: 'Old Title' };
            const mockUpdatedChat = { id: 'chat-123', title: 'New Title' };

            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);
            prisma.specbot_chats.update.mockResolvedValue(mockUpdatedChat);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                body: { title: 'New Title' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await updateSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.chat.title).toBe('New Title');
        });

        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                body: { title: 'New Title' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await updateSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when not owner', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({ id: 'chat-123', user_id: 'other-user' });

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                body: { title: 'New Title' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await updateSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 500 on error', async () => {
            prisma.specbot_chats.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                body: { title: 'New Title' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await updateSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('createMessage', () => {
        it('should create user message and bot response for specbot chat', async () => {
            const mockSpecbotChat = { id: 'chat-123' };
            const mockUser = { id: 'user-123' };
            const mockUserMessage = { id: 'msg-1', content: 'Hello', sender_type: 'user' };
            const mockBotMessage = { id: 'msg-2', content: 'AI response', sender_type: 'bot' };

            prisma.specbot_chats.findUnique.mockResolvedValue(mockSpecbotChat);
            prisma.users.findUnique.mockResolvedValue(mockUser);
            prisma.messages.create
                .mockResolvedValueOnce(mockUserMessage)
                .mockResolvedValueOnce(mockBotMessage);

            const req = createMockRequest({
                body: {
                    chat_type: 'specbot',
                    chat_id: 'chat-123',
                    content: 'Hello',
                    sender_type: 'user',
                    sender_id: 'user-123',
                },
            });
            const res = createMockResponse();

            await createMessage(req, res);

            expect(generateGeminiResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.data).toEqual(mockUserMessage);
            expect(res.jsonData.botMessage).toEqual(mockBotMessage);
        });

        it('should return 502 on Gemini error', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({ id: 'chat-123' });
            prisma.users.findUnique.mockResolvedValue({ id: 'user-123' });
            prisma.messages.create.mockResolvedValue({ id: 'msg-1' });
            generateGeminiResponse.mockRejectedValue(new Error('API error'));

            const req = createMockRequest({
                body: {
                    chat_type: 'specbot',
                    chat_id: 'chat-123',
                    content: 'Hello',
                    sender_type: 'user',
                    sender_id: 'user-123',
                },
            });
            const res = createMockResponse();

            await createMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(502);
        });
    });

    describe('getAllMessages', () => {
        it('should return messages for chat owner', async () => {
            const mockChat = { id: 'chat-123', user_id: 'user-123', project_id: 'proj-123' };
            const mockMessages = [
                { id: 'msg-1', content: 'Hello' },
                { id: 'msg-2', content: 'Hi there' },
            ];

            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);
            prisma.messages.findMany.mockResolvedValue(mockMessages);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
        });

        it('should allow manager to see all chats', async () => {
            const mockChat = { id: 'chat-123', user_id: 'other-user', project_id: 'proj-123' };
            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);
            prisma.messages.findMany.mockResolvedValue([]);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'manager-id', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 403 when client tries to access others chat', async () => {
            const mockChat = { id: 'chat-123', user_id: 'other-user', project_id: 'proj-123' };
            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            prisma.specbot_chats.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('downloadSpecbotChat', () => {
        it('should download chat successfully for owner', async () => {
            const mockChat = {
                id: 'chat-123',
                user_id: 'user-123',
                project_id: 'proj-123',
                projects: { id: 'proj-123', name: 'Test', slug: 'test' },
                users: { id: 'user-123', username: 'testuser' },
            };
            prisma.specbot_chats.findUnique.mockResolvedValue(mockChat);
            prisma.messages.findMany.mockResolvedValue([]);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await downloadSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.downloaded).toBe(true);
        });

        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await downloadSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when client tries to download others chat', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({
                id: 'chat-123',
                user_id: 'other-user',
            });

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await downloadSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('summarizeSpecbotChat', () => {
        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await summarizeSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when client tries to summarize others chat', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({
                id: 'chat-123',
                user_id: 'other-user',
                project_id: 'proj-123',
            });

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await summarizeSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('extractRequirementsFromChat', () => {
        it('should return 404 when chat not found', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'manager' },
            });
            const res = createMockResponse();

            await extractRequirementsFromChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 403 when client tries to extract from others chat', async () => {
            prisma.specbot_chats.findUnique.mockResolvedValue({
                id: 'chat-123',
                user_id: 'other-user',
                project_id: 'proj-123',
            });

            const req = createMockRequest({
                params: { chatId: 'chat-123' },
                user: { userId: 'user-123', role: 'client' },
            });
            const res = createMockResponse();

            await extractRequirementsFromChat(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });
});
