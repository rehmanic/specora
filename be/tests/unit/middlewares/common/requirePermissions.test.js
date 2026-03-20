/**
 * requirePermissions Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requirePermissions } from '../../../../src/middlewares/common/requirePermissions.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('requirePermissions Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call next when user has all required permissions', () => {
        const middleware = requirePermissions('view_users', 'add_user');
        const req = createMockRequest({
            user: { permissions: ['view_users', 'add_user', 'delete_user'] }
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 403 when user is missing a required permission', () => {
        const middleware = requirePermissions('view_users', 'add_user');
        const req = createMockRequest({
            user: { permissions: ['view_users'] }
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.jsonData.message).toBe('Access denied: Missing required permissions');
        expect(next).not.toHaveBeenCalled();
    });

    it('should work with a single permission', () => {
        const middleware = requirePermissions('view_users');
        const req = createMockRequest({
            user: { permissions: ['view_users', 'add_user'] }
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 403 when user permissions array is empty', () => {
        const middleware = requirePermissions('view_users');
        const req = createMockRequest({
            user: { permissions: [] }
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.jsonData.message).toBe('Access denied: Missing required permissions');
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when user has no permissions property', () => {
        const middleware = requirePermissions('view_users');
        const req = createMockRequest({
            user: {}
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.jsonData.message).toBe('Access denied: Missing required permissions');
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next when no permissions are required', () => {
        const middleware = requirePermissions();
        const req = createMockRequest({
            user: { permissions: [] }
        });
        const res = createMockResponse();
        const next = createMockNext();

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
