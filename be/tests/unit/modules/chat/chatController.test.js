import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as chatController from '../../../../src/modules/chat/chatController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Chat Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getProjectGroupChat', () => {
        it('returns existing group chat when UUID is provided', async () => {
            const req = createMockRequest({
                params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
            });
            const res = createMockResponse();

            const mockChat = { id: 'chat-1', project_id: req.params.projectId };
            prisma.group_chat.findFirst.mockResolvedValue(mockChat);

            await chatController.getProjectGroupChat(req, res);

            expect(prisma.group_chat.findFirst).toHaveBeenCalledWith({
                where: { project_id: req.params.projectId }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData).toEqual({
                message: "Group chat fetched successfully",
                chat: mockChat
            });
        });

        it('resolves slug to UUID and returns chat', async () => {
            const req = createMockRequest({
                params: { projectId: 'my-project-slug' }
            });
            const res = createMockResponse();

            const mockProject = { id: 'proj-uuid' };
            prisma.project.findUnique.mockResolvedValue(mockProject);
            
            const mockChat = { id: 'chat-1', project_id: 'proj-uuid' };
            prisma.group_chat.findFirst.mockResolvedValue(mockChat);

            await chatController.getProjectGroupChat(req, res);

            expect(prisma.project.findUnique).toHaveBeenCalledWith({
                where: { slug: 'my-project-slug' }
            });
            expect(prisma.group_chat.findFirst).toHaveBeenCalledWith({
                where: { project_id: 'proj-uuid' }
            });
        });

        it('creates a new group chat if none exists', async () => {
            const req = createMockRequest({
                params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
            });
            const res = createMockResponse();

            prisma.group_chat.findFirst.mockResolvedValue(null);
            
            const newChat = { id: 'chat-new', project_id: req.params.projectId };
            prisma.group_chat.create.mockResolvedValue(newChat);

            await chatController.getProjectGroupChat(req, res);

            expect(prisma.group_chat.create).toHaveBeenCalledWith({
                data: { project_id: req.params.projectId }
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 if project not found by slug', async () => {
            const req = createMockRequest({
                params: { projectId: 'invalid-slug' }
            });
            const res = createMockResponse();

            prisma.project.findUnique.mockResolvedValue(null);

            await chatController.getProjectGroupChat(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData).toEqual({ message: "Project not found" });
        });
    });

    describe('getGroupMessages', () => {
        it('fetches messages and enriches with sender details', async () => {
            const req = createMockRequest({
                params: { chatId: 'chat-1' },
                query: { page: 1, limit: 10 }
            });
            const res = createMockResponse();

            const mockMessages = [
                { id: 'msg-1', content: 'hello', sender_id: 'user-1' }
            ];
            const mockUsers = [
                { id: 'user-1', username: 'john', display_name: 'John' }
            ];

            prisma.group_message.findMany.mockResolvedValue(mockMessages);
            prisma.app_user.findMany.mockResolvedValue(mockUsers);

            await chatController.getGroupMessages(req, res);

            expect(prisma.group_message.findMany).toHaveBeenCalledWith({
                where: { group_chat_id: 'chat-1' },
                skip: 0,
                take: 10,
                orderBy: { created_at: "asc" }
            });

            expect(prisma.app_user.findMany).toHaveBeenCalledWith({
                where: { id: { in: ['user-1'] } },
                select: { id: true, username: true, display_name: true, profile_pic_url: true }
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData).toEqual({
                message: "Group messages fetched successfully",
                messages: [{ ...mockMessages[0], sender: mockUsers[0] }]
            });
        });
    });

    describe('saveGroupMessage', () => {
        it('saves a message without attachments', async () => {
            const req = createMockRequest({
                params: { chatId: 'chat-1' },
                body: { content: 'test msg', senderId: 'user-1' }
            });
            const res = createMockResponse();

            const mockSavedMsg = { id: 'msg-1', content: 'test msg', sender_id: 'user-1' };
            prisma.group_message.create.mockResolvedValue(mockSavedMsg);

            await chatController.saveGroupMessage(req, res);

            expect(prisma.group_message.create).toHaveBeenCalledWith({
                data: {
                    group_chat_id: 'chat-1',
                    content: 'test msg',
                    sender_id: 'user-1',
                    metadata: undefined,
                }
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData).toEqual({
                message: "Message saved",
                data: mockSavedMsg
            });
        });

        it('saves a message and updates chat attachments if present', async () => {
            const req = createMockRequest({
                params: { chatId: 'chat-1' },
                body: { 
                    content: 'test msg', 
                    senderId: 'user-1',
                    metadata: { attachments: ['file-1.jpg'] }
                }
            });
            const res = createMockResponse();

            const mockSavedMsg = { id: 'msg-1', metadata: req.body.metadata };
            prisma.group_message.create.mockResolvedValue(mockSavedMsg);
            prisma.group_chat.findUnique.mockResolvedValue({ id: 'chat-1', attachments: [] });

            await chatController.saveGroupMessage(req, res);

            expect(prisma.group_chat.update).toHaveBeenCalledWith({
                where: { id: 'chat-1' },
                data: { attachments: ['file-1.jpg'] }
            });
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('deleteGroupMessage', () => {
        it('soft deletes a message if requested by sender', async () => {
            const req = createMockRequest({
                params: { messageId: 'msg-1' },
                user: { userId: 'user-1' }
            });
            const res = createMockResponse();

            const mockMessage = { id: 'msg-1', sender_id: 'user-1' };
            const updatedMsg = { id: 'msg-1', content: 'This message was deleted' };
            const mockSender = { id: 'user-1', username: 'john' };

            prisma.group_message.findUnique.mockResolvedValue(mockMessage);
            prisma.group_message.update.mockResolvedValue(updatedMsg);
            prisma.app_user.findUnique.mockResolvedValue(mockSender);

            await chatController.deleteGroupMessage(req, res);

            expect(prisma.group_message.update).toHaveBeenCalledWith({
                where: { id: 'msg-1' },
                data: {
                    content: "This message was deleted",
                    metadata: { is_deleted: true }
                }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData).toEqual({
                message: "Message deleted successfully",
                data: { ...updatedMsg, sender: mockSender }
            });
        });

        it('returns 403 if requested by non-sender', async () => {
            const req = createMockRequest({
                params: { messageId: 'msg-1' },
                user: { userId: 'user-2' } // different user
            });
            const res = createMockResponse();

            const mockMessage = { id: 'msg-1', sender_id: 'user-1' };
            prisma.group_message.findUnique.mockResolvedValue(mockMessage);

            await chatController.deleteGroupMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.jsonData).toEqual({ message: "Not authorized to delete this message" });
        });

        it('returns 404 if message does not exist', async () => {
            const req = createMockRequest({
                params: { messageId: 'invalid-msg' },
                user: { userId: 'user-1' }
            });
            const res = createMockResponse();

            prisma.group_message.findUnique.mockResolvedValue(null);

            await chatController.deleteGroupMessage(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData).toEqual({ message: "Message not found" });
        });
    });
});
