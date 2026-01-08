/**
 * roleCheck Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requireManager, requireClient, requireRoles } from '../../../../src/middlewares/common/roleCheck.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('roleCheck Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('requireManager', () => {
        it('should call next when user is manager', () => {
            const req = createMockRequest({ user: { role: 'manager' } });
            const res = createMockResponse();
            const next = createMockNext();

            requireManager(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 when user is not manager', () => {
            const req = createMockRequest({ user: { role: 'client' } });
            const res = createMockResponse();
            const next = createMockNext();

            requireManager(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.jsonData.message).toBe('Manager access required');
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireClient', () => {
        it('should call next when user is client', () => {
            const req = createMockRequest({ user: { role: 'client' } });
            const res = createMockResponse();
            const next = createMockNext();

            requireClient(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 when user is not client', () => {
            const req = createMockRequest({ user: { role: 'manager' } });
            const res = createMockResponse();
            const next = createMockNext();

            requireClient(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.jsonData.message).toBe('Client access required');
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('requireRoles', () => {
        it('should call next when user role is in allowed list', () => {
            const middleware = requireRoles('manager', 'requirements_engineer');
            const req = createMockRequest({ user: { role: 'manager' } });
            const res = createMockResponse();
            const next = createMockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should call next for second role in list', () => {
            const middleware = requireRoles('manager', 'requirements_engineer');
            const req = createMockRequest({ user: { role: 'requirements_engineer' } });
            const res = createMockResponse();
            const next = createMockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 when user role is not in allowed list', () => {
            const middleware = requireRoles('manager', 'requirements_engineer');
            const req = createMockRequest({ user: { role: 'client' } });
            const res = createMockResponse();
            const next = createMockNext();

            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.jsonData.message).toBe('Access denied for this role');
            expect(next).not.toHaveBeenCalled();
        });

        it('should work with single role', () => {
            const middleware = requireRoles('manager');
            const req = createMockRequest({ user: { role: 'manager' } });
            const res = createMockResponse();
            const next = createMockNext();

            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
