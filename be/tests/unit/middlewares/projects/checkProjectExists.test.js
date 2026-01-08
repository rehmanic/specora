/**
 * checkProjectExists Middleware Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import checkProjectExists from '../../../../src/middlewares/projects/checkProjectExists.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

describe('checkProjectExists Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('action: create', () => {
        it('should return 409 when project already exists', async () => {
            const mockProject = { id: 'proj-123', name: 'Existing Project' };
            prisma.projects.findUnique.mockResolvedValue(mockProject);

            const middleware = checkProjectExists('create');
            const req = createMockRequest({ body: { name: 'Existing Project' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.jsonData.message).toBe('Project already exists');
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next when project does not exist', async () => {
            prisma.projects.findUnique.mockResolvedValue(null);

            const middleware = checkProjectExists('create');
            const req = createMockRequest({ body: { name: 'New Project' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('action: update', () => {
        it('should call next when project exists', async () => {
            const mockProject = { id: 'proj-123', name: 'Existing Project' };
            prisma.projects.findUnique.mockResolvedValue(mockProject);

            const middleware = checkProjectExists('update');
            const req = createMockRequest({ params: { projectId: 'proj-123' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 401 when project does not exist', async () => {
            prisma.projects.findUnique.mockResolvedValue(null);

            const middleware = checkProjectExists('update');
            const req = createMockRequest({ params: { projectId: 'nonexistent' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.jsonData.message).toBe("Project doesn't exist");
            expect(next).not.toHaveBeenCalled();
        });
    });

    it('should return 500 on database error', async () => {
        prisma.projects.findUnique.mockRejectedValue(new Error('DB error'));

        const middleware = checkProjectExists('create');
        const req = createMockRequest({ body: { name: 'Test Project' } });
        const res = createMockResponse();
        const next = createMockNext();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.jsonData.message).toBe('Internal server error');
        expect(next).not.toHaveBeenCalled();
    });
});
