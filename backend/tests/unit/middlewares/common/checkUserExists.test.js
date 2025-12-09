/**
 * checkUserExists Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import checkUserExists from '../../../../src/middlewares/common/checkUserExists.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('checkUserExists Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('action: by-username', () => {
        it('should call next and attach user when found by username', async () => {
            const mockUser = { id: 'user-123', username: 'testuser' };
            prisma.users.findUnique.mockResolvedValue(mockUser);

            const middleware = checkUserExists('by-username');
            const req = createMockRequest({ body: { username: 'testuser' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('should return 404 when user not found by username', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const middleware = checkUserExists('by-username');
            const req = createMockRequest({ body: { username: 'nonexistent' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('User not found');
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('action: by-id', () => {
        it('should call next and attach user when found by id', async () => {
            const mockUser = { id: 'user-123', username: 'testuser' };
            prisma.users.findUnique.mockResolvedValue(mockUser);

            const middleware = checkUserExists('by-id');
            const req = createMockRequest({ params: { userId: 'user-123' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalled();
        });

        it('should return 404 when user not found by id', async () => {
            prisma.users.findUnique.mockResolvedValue(null);

            const middleware = checkUserExists('by-id');
            const req = createMockRequest({ params: { userId: 'nonexistent' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('User not found');
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('action: by-username-email', () => {
        it('should return 404 when username or email already in use', async () => {
            const mockUser = { id: 'user-123', username: 'testuser', email: 'test@example.com' };
            prisma.users.findFirst.mockResolvedValue(mockUser);

            const middleware = checkUserExists('by-username-email');
            const req = createMockRequest({
                body: { username: 'testuser', email: 'test@example.com' },
            });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Username or email already in use');
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next when username and email are available', async () => {
            prisma.users.findFirst.mockResolvedValue(null);

            const middleware = checkUserExists('by-username-email');
            const req = createMockRequest({
                body: { username: 'newuser', email: 'new@example.com' },
            });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    it('should return 500 on database error', async () => {
        prisma.users.findUnique.mockRejectedValue(new Error('DB error'));

        const middleware = checkUserExists('by-username');
        const req = createMockRequest({ body: { username: 'testuser' } });
        const res = createMockResponse();
        const next = createMockNext();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.jsonData.message).toBe('Internal server error');
        expect(next).not.toHaveBeenCalled();
    });
});
