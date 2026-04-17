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
        it('creates a specbot chat when the project exists', async () => {
            prisma.project.findUnique.mockResolvedValue({ id: 'proj-123', created_by: 'user-123' });
            prisma.specbot_chat.create.mockResolvedValue({ id: 'chat-123', title: 'New Chat', project_id: 'proj-123' });

            const req = createMockRequest({ body: { title: 'New Chat', project_id: 'proj-123' } });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.chat.id).toBe('chat-123');
        });

        it('returns 404 when the project is missing', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ body: { title: 'New Chat', project_id: 'proj-123' } });
            const res = createMockResponse();

            await createSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Project not found');
        });
    });

    describe('deleteSpecbotChat', () => {
        it('deletes a chat for its creator', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project: { created_by: 'user-123', project_member: [] },
            });

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(clearChatSession).toHaveBeenCalledWith('chat-123');
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when the chat is missing', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await deleteSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllSpecbotChats', () => {
        it('returns 400 when projectId is missing', async () => {
            const req = createMockRequest({ query: {}, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toBe('Project ID is required');
        });

        it('creates a default chat when none exists', async () => {
            prisma.project.findUnique.mockResolvedValue({
                id: 'proj-123',
                created_by: 'user-123',
                project_member: [],
            });
            prisma.specbot_chat.findFirst.mockResolvedValue(null);
            prisma.specbot_chat.create.mockResolvedValue({ id: 'chat-123', title: 'Default Specbot Chat' });

            const req = createMockRequest({ query: { projectId: 'proj-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await getAllSpecbotChats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.chats).toHaveLength(1);
        });
    });

    describe('updateSpecbotChat', () => {
        it('updates the chat title for the creator', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project: { created_by: 'user-123', project_member: [] },
            });
            prisma.specbot_chat.update.mockResolvedValue({ id: 'chat-123', title: 'New Title' });

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
    });

    describe('createMessage', () => {
        it('creates a specbot message and bot reply', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({ id: 'chat-123' });
            prisma.specbot_chat.update.mockResolvedValue({});
            prisma.specbot_message.create
                .mockResolvedValueOnce({ id: 'msg-1', content: 'Hello', sender_type: 'user' })
                .mockResolvedValueOnce({ id: 'msg-2', content: 'AI response', sender_type: 'bot' });

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
            expect(res.jsonData.data.id).toBe('msg-1');
            expect(res.jsonData.botMessage.id).toBe('msg-2');
        });
    });

    describe('getAllMessages', () => {
        it('returns chat messages for the creator', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project: { created_by: 'user-123', project_member: [] },
            });
            prisma.specbot_message.findMany.mockResolvedValue([{ id: 'msg-1', content: 'Hello' }]);

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await getAllMessages(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(1);
        });
    });

    describe('downloadSpecbotChat', () => {
        it('downloads and stores the chat', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project_id: 'proj-123',
                updated_at: new Date('2024-01-01'),
                last_downloaded_at: null,
                project: {
                    created_by: 'user-123',
                    project_member: [],
                    app_user: { id: 'user-123', username: 'owner', display_name: 'Owner' },
                },
            });
            prisma.specbot_message.findMany.mockResolvedValue([]);

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await downloadSpecbotChat(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.downloaded).toBe(true);
        });
    });

    describe('summarizeSpecbotChat', () => {
        it('summarizes the stored chat', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project_id: 'proj-123',
                updated_at: new Date('2024-01-01'),
                last_summarized_at: null,
                project: { created_by: 'user-123', project_member: [] },
            });
            prisma.specbot_chat.update.mockResolvedValue({});

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await summarizeSpecbotChat(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.artifact.type).toBe('summary');
        });
    });

    describe('extractRequirementsFromChat', () => {
        it('extracts requirements from the stored chat', async () => {
            prisma.specbot_chat.findUnique.mockResolvedValue({
                id: 'chat-123',
                project_id: 'proj-123',
                updated_at: new Date('2024-01-01'),
                last_extracted_at: null,
                project: { created_by: 'user-123', project_member: [] },
            });
            prisma.specbot_chat.update.mockResolvedValue({});

            const req = createMockRequest({ params: { chatId: 'chat-123' }, user: { userId: 'user-123' } });
            const res = createMockResponse();

            await extractRequirementsFromChat(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.artifact.type).toBe('requirements');
        });
    });
});
