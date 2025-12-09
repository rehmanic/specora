/**
 * Auth Controller Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signup, login } from '../../../../src/modules/auth/authController.js';
import prisma from '../../../../config/db/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Auth Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('signup', () => {
        it('should create a new user and return token on success', async () => {
            const mockUser = {
                id: 'user-123',
                username: 'testuser',
                email: 'test@example.com',
                password_hash: 'hashed_password',
                role: 'manager',
                created_at: new Date(),
            };

            prisma.users.create.mockResolvedValue(mockUser);

            const req = createMockRequest({
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            const res = createMockResponse();

            await signup(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(prisma.users.create).toHaveBeenCalledWith({
                data: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password_hash: 'hashed_password',
                },
            });
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe('User registered successfully');
            expect(res.jsonData.token).toBe('mock-jwt-token');
            expect(res.jsonData.user).not.toHaveProperty('password_hash');
        });

        it('should return 500 on internal error', async () => {
            prisma.users.create.mockRejectedValue(new Error('Database error'));

            const req = createMockRequest({
                body: {
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                },
            });
            const res = createMockResponse();

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.jsonData.message).toBe('Internal server error');
        });
    });

    describe('login', () => {
        it('should return token on valid credentials', async () => {
            const mockUser = {
                id: 'user-123',
                username: 'testuser',
                email: 'test@example.com',
                password_hash: 'hashed_password',
                role: 'manager',
            };

            bcrypt.compare.mockResolvedValue(true);

            const req = createMockRequest({
                body: { password: 'password123' },
                user: mockUser,
            });
            const res = createMockResponse();

            await login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
            expect(jwt.sign).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('Login successful');
            expect(res.jsonData.token).toBe('mock-jwt-token');
            expect(res.jsonData.user).not.toHaveProperty('password_hash');
        });

        it('should return 401 on invalid password', async () => {
            const mockUser = {
                id: 'user-123',
                username: 'testuser',
                password_hash: 'hashed_password',
                role: 'manager',
            };

            bcrypt.compare.mockResolvedValue(false);

            const req = createMockRequest({
                body: { password: 'wrongpassword' },
                user: mockUser,
            });
            const res = createMockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.jsonData.message).toBe('Invalid credentials');
        });

        it('should return 500 on internal error', async () => {
            bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

            const req = createMockRequest({
                body: { password: 'password123' },
                user: { password_hash: 'hashed_password' },
            });
            const res = createMockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.jsonData.message).toBe('Internal server error');
        });
    });
});
