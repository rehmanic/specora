/**
 * verifyToken Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { verifyToken } from '../../../../src/middlewares/common/verifyToken.js';
import jwt from 'jsonwebtoken';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('verifyToken Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 when authorization header is missing', () => {
        const req = createMockRequest({ headers: {} });
        const res = createMockResponse();
        const next = createMockNext();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.jsonData.message).toBe('Authorization header missing');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when bearer token is not found', () => {
        // When authorization header is 'Bearer ' with nothing after it, split(' ')[1] is undefined
        const req = createMockRequest({ headers: { authorization: 'Bearer ' } });
        const res = createMockResponse();
        const next = createMockNext();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.jsonData.message).toBe('Bearer token not found');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
        const req = createMockRequest({ headers: { authorization: 'Bearer invalid-token' } });
        const res = createMockResponse();
        const next = createMockNext();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.jsonData.message).toBe('Invalid or expired token');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when token is expired', () => {
        const req = createMockRequest({ headers: { authorization: 'Bearer expired-token' } });
        const res = createMockResponse();
        const next = createMockNext();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('should attach decoded user and call next when token is valid', () => {
        const req = createMockRequest({ headers: { authorization: 'Bearer valid-token' } });
        const res = createMockResponse();
        const next = createMockNext();

        verifyToken(req, res, next);

        expect(req.user).toEqual({ userId: 'user-123', username: 'testuser', role: 'manager' });
        expect(next).toHaveBeenCalled();
    });
});
