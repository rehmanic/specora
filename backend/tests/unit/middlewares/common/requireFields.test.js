/**
 * requireFields Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import requireFields from '../../../../src/middlewares/common/requireFields.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('requireFields Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 when required field is missing', () => {
        const middleware = requireFields(['username', 'email', 'password']);
        const req = createMockRequest({ body: { username: 'testuser' } });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.jsonData.message).toBe('email is required');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 for first missing field', () => {
        const middleware = requireFields(['username', 'email', 'password']);
        const req = createMockRequest({ body: {} });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.jsonData.message).toBe('username is required');
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next when all required fields are present', () => {
        const middleware = requireFields(['username', 'email', 'password']);
        const req = createMockRequest({
            body: { username: 'testuser', email: 'test@example.com', password: 'pass123' },
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next when no fields are required', () => {
        const middleware = requireFields([]);
        const req = createMockRequest({ body: {} });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 400 when field value is falsy (empty string)', () => {
        const middleware = requireFields(['username']);
        const req = createMockRequest({ body: { username: '' } });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.jsonData.message).toBe('username is required');
    });
});
