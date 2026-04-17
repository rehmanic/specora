/**
 * User Controller Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createUser,
    getAllUsers,
    getUserByUsername,
    getUsersByIds,
    updateUser,
    deleteUser,
} from '../../../../src/modules/users/userController.js';
import prisma from '../../../../config/db/prismaClient.js';
import bcrypt from 'bcrypt';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('User Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createUser', () => {
        it('creates a user when the role exists', async () => {
            const mockRole = { id: 'role-1', name: 'client', role_permission: [] };
            const mockUser = {
                id: 'user-123',
                username: 'newuser',
                password_hash: 'hashed_password',
                email: 'new@example.com',
                profile_pic_url: null,
                display_name: 'New User',
                role: mockRole,
                created_at: new Date(),
            };

            prisma.role.findUnique.mockResolvedValue(mockRole);
            prisma.app_user.create.mockResolvedValue(mockUser);

            const req = createMockRequest({
                body: {
                    username: 'newuser',
                    password: 'password123',
                    email: 'new@example.com',
                    display_name: 'New User',
                },
            });
            const res = createMockResponse();

            await createUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(prisma.app_user.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.user.username).toBe('newuser');
        });

        it('returns 500 when role is missing', async () => {
            prisma.role.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                body: { username: 'newuser', password: 'pass', email: 'new@example.com' },
            });
            const res = createMockResponse();

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.jsonData.message).toBe('Role not found');
        });
    });

    describe('getAllUsers', () => {
        it('returns formatted users', async () => {
            prisma.app_user.findMany.mockResolvedValue([
                {
                    id: '1',
                    username: 'user1',
                    email: 'user1@test.com',
                    display_name: 'User One',
                    profile_pic_url: null,
                    role: { name: 'client', role_permission: [] },
                    _count: { project_member: 2 },
                    created_at: new Date('2024-01-01'),
                    updated_at: new Date('2024-01-02'),
                },
            ]);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(1);
            expect(res.jsonData.users[0].projects_count).toBe(2);
        });

        it('returns 404 when empty', async () => {
            prisma.app_user.findMany.mockResolvedValue([]);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('No users found');
        });
    });

    describe('getUserByUsername', () => {
        it('returns a formatted user when found', async () => {
            prisma.app_user.findUnique.mockResolvedValue({
                id: '1',
                username: 'testuser',
                email: 'test@test.com',
                display_name: 'Test User',
                profile_pic_url: null,
                role: { name: 'manager', role_permission: [] },
                created_at: new Date(),
                updated_at: new Date(),
            });

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await getUserByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.user.username).toBe('testuser');
        });

        it('returns 404 when not found', async () => {
            prisma.app_user.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { username: 'missing' } });
            const res = createMockResponse();

            await getUserByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getUsersByIds', () => {
        it('returns formatted users for a list of ids', async () => {
            prisma.app_user.findMany.mockResolvedValue([
                { id: '1', username: 'user1', email: 'u1@test.com', display_name: 'U1', profile_pic_url: null, role: { name: 'client', role_permission: [] }, created_at: new Date(), updated_at: new Date() },
                { id: '2', username: 'user2', email: 'u2@test.com', display_name: 'U2', profile_pic_url: null, role: { name: 'manager', role_permission: [] }, created_at: new Date(), updated_at: new Date() },
            ]);

            const req = createMockRequest({ body: { userIds: ['1', '2'] } });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
        });

        it('returns 400 for missing ids', async () => {
            const req = createMockRequest({ body: {} });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateUser', () => {
        it('hashes password and updates role when provided', async () => {
            const mockRole = { id: 'role-2', name: 'manager' };
            prisma.role.findUnique.mockResolvedValue(mockRole);
            prisma.app_user.update.mockResolvedValue({
                id: '1',
                username: 'testuser',
                email: 'updated@test.com',
                display_name: 'Test User',
                profile_pic_url: null,
                role: { name: 'manager', role_permission: [] },
                password_hash: 'hashed_password',
            });

            const req = createMockRequest({
                body: {
                    username: 'testuser',
                    password: 'newpassword',
                    role: 'manager',
                    email: 'updated@test.com',
                },
            });
            const res = createMockResponse();

            await updateUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when role is missing', async () => {
            prisma.role.findUnique.mockResolvedValue(null);

            const req = createMockRequest({
                body: { username: 'testuser', role: 'manager' },
            });
            const res = createMockResponse();

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Role not found');
        });
    });

    describe('deleteUser', () => {
        it('deletes an existing user', async () => {
            prisma.app_user.findUnique.mockResolvedValue({ id: '1', username: 'testuser' });
            prisma.app_user.delete.mockResolvedValue({});

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('User deleted successfully');
        });

        it('returns 404 when the user is missing', async () => {
            prisma.app_user.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { username: 'missing' } });
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
