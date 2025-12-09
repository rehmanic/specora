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
        it('should create a new user successfully', async () => {
            const mockUser = {
                id: 'user-123',
                username: 'newuser',
                password_hash: 'hashed_password',
                role: 'client',
                permissions: ['view_projects'],
                email: 'new@example.com',
                profile_pic_url: null,
                display_name: 'New User',
                created_at: new Date(),
            };

            prisma.users.create.mockResolvedValue(mockUser);

            const req = createMockRequest({
                body: {
                    username: 'newuser',
                    password: 'password123',
                    role: 'client',
                    permissions: ['view_projects'],
                    email: 'new@example.com',
                    display_name: 'New User',
                },
            });
            const res = createMockResponse();

            await createUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(prisma.users.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.user).not.toHaveProperty('password_hash');
        });

        it('should return 500 on error', async () => {
            prisma.users.create.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                body: { username: 'newuser', password: 'pass' },
            });
            const res = createMockResponse();

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: '1', username: 'user1', email: 'user1@test.com' },
                { id: '2', username: 'user2', email: 'user2@test.com' },
            ];

            prisma.users.findMany.mockResolvedValue(mockUsers);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
            expect(res.jsonData.users).toEqual(mockUsers);
        });

        it('should return 404 when no users found', async () => {
            prisma.users.findMany.mockResolvedValue([]);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('No users found');
        });

        it('should return 500 on error', async () => {
            prisma.users.findMany.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getUserByUsername', () => {
        it('should return user when found', async () => {
            const mockUser = { id: '1', username: 'testuser', email: 'test@test.com' };
            prisma.users.findUnique.mockResolvedValue(mockUser);

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await getUserByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.user).toEqual(mockUser);
        });

        it('should return 404 when user not found', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { username: 'nonexistent' } });
            const res = createMockResponse();

            await getUserByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            prisma.users.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await getUserByUsername(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getUsersByIds', () => {
        it('should return users for given IDs', async () => {
            const mockUsers = [
                { id: '1', username: 'user1' },
                { id: '2', username: 'user2' },
            ];
            prisma.users.findMany.mockResolvedValue(mockUsers);

            const req = createMockRequest({ body: { userIds: ['1', '2'] } });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
        });

        it('should return 400 when userIds is invalid', async () => {
            const req = createMockRequest({ body: {} });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 400 when userIds is empty array', async () => {
            const req = createMockRequest({ body: { userIds: [] } });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 500 on error', async () => {
            prisma.users.findMany.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({ body: { userIds: ['1'] } });
            const res = createMockResponse();

            await getUsersByIds(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateUser', () => {
        it('should update user without password change', async () => {
            const mockUpdatedUser = {
                id: '1',
                username: 'testuser',
                password_hash: 'old_hash',
                role: 'manager',
                email: 'updated@test.com',
            };
            prisma.users.update.mockResolvedValue(mockUpdatedUser);

            const req = createMockRequest({
                body: {
                    username: 'testuser',
                    role: 'manager',
                    email: 'updated@test.com',
                },
            });
            const res = createMockResponse();

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.user).not.toHaveProperty('password_hash');
        });

        it('should update user with new password', async () => {
            const mockUpdatedUser = {
                id: '1',
                username: 'testuser',
                password_hash: 'new_hash',
                role: 'manager',
            };
            prisma.users.update.mockResolvedValue(mockUpdatedUser);

            const req = createMockRequest({
                body: {
                    username: 'testuser',
                    password: 'newpassword',
                    role: 'manager',
                },
            });
            const res = createMockResponse();

            await updateUser(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should return 500 on error', async () => {
            prisma.users.update.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                body: { username: 'testuser', role: 'manager' },
            });
            const res = createMockResponse();

            await updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            prisma.users.findUnique.mockResolvedValue({ id: '1', username: 'testuser' });
            prisma.users.delete.mockResolvedValue({});

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('User deleted successfully');
        });

        it('should return 404 when user not found', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { username: 'nonexistent' } });
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 500 on error', async () => {
            prisma.users.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({ params: { username: 'testuser' } });
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
