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
        it('returns 409 when a project already exists', async () => {
            prisma.project.findUnique.mockResolvedValue({ id: 'proj-123', name: 'Existing Project' });

            const middleware = checkProjectExists('create');
            const req = createMockRequest({ body: { name: 'Existing Project' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.jsonData.message).toBe('Project already exists');
        });

        it('calls next when the name is available', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            const middleware = checkProjectExists('create');
            const req = createMockRequest({ body: { name: 'New Project' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('action: update', () => {
        it('calls next when the project exists', async () => {
            prisma.project.findUnique.mockResolvedValue({ id: 'proj-123', name: 'Existing Project' });

            const middleware = checkProjectExists('update');
            const req = createMockRequest({ params: { projectId: 'proj-123' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('returns 401 when the project is missing', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            const middleware = checkProjectExists('update');
            const req = createMockRequest({ params: { projectId: 'nonexistent' } });
            const res = createMockResponse();
            const next = createMockNext();

            await middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.jsonData.message).toBe("Project doesn't exist");
        });
    });

    it('returns 500 on database error', async () => {
        prisma.project.findUnique.mockRejectedValue(new Error('DB error'));

        const middleware = checkProjectExists('create');
        const req = createMockRequest({ body: { name: 'Test Project' } });
        const res = createMockResponse();
        const next = createMockNext();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.jsonData.message).toBe('Internal server error');
    });
});
