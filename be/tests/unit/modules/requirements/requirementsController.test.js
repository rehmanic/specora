import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as requirementsController from '../../../../src/modules/requirements/requirementsController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Requirements Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' },
            user: { userId: 'user-1' }
        });
        res = createMockResponse();
    });

    describe('getProjectRequirements', () => {
        it('fetches project requirements successfully', async () => {
            const mockReqs = [{ id: 'req-1', title: 'Test Req', parent_id: null }];
            prisma.requirement.findMany.mockResolvedValue(mockReqs);

            await requirementsController.getProjectRequirements(req, res);

            expect(prisma.requirement.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { project_id: '123e4567-e89b-12d3-a456-426614174000', parent_id: null }
            }));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.requirements).toEqual(mockReqs);
        });

        it('resolves project slug and fetches requirements', async () => {
            req.params.projectId = 'project-slug';
            prisma.project.findFirst.mockResolvedValue({ id: 'proj-1' });
            prisma.requirement.findMany.mockResolvedValue([]);

            await requirementsController.getProjectRequirements(req, res);

            expect(prisma.project.findFirst).toHaveBeenCalledWith({
                where: { slug: 'project-slug' }, select: { id: true }
            });
            expect(prisma.requirement.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { project_id: 'proj-1', parent_id: null }
            }));
        });
    });

    describe('createRequirement', () => {
        it('creates a requirement and auto-generates readable ID', async () => {
            req.body = { title: 'New Req', description: 'Desc' };
            
            // Mock generateReadableId internals:
            prisma.requirement.findMany.mockResolvedValue([]); // roots
            
            const newReq = { id: 'req-1', readable_id: 'REQ-001', title: 'New Req' };
            prisma.requirement.create.mockResolvedValue(newReq);

            await requirementsController.createRequirement(req, res);

            expect(prisma.requirement.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    project_id: '123e4567-e89b-12d3-a456-426614174000',
                    readable_id: 'REQ-001',
                    title: 'New Req',
                })
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.requirement).toEqual(newReq);
        });
    });

    describe('updateRequirement', () => {
        it('updates requirement and saves history if changed', async () => {
            req.params.requirementId = 'req-1';
            req.body = { title: 'Updated Title' };

            const existing = { id: 'req-1', title: 'Old Title' };
            prisma.requirement.findUnique.mockResolvedValue(existing);
            prisma.requirement_history.count.mockResolvedValue(0);
            prisma.requirement_history.create.mockResolvedValue({});
            
            const updated = { id: 'req-1', title: 'Updated Title' };
            prisma.requirement.update.mockResolvedValue(updated);

            await requirementsController.updateRequirement(req, res);

            expect(prisma.requirement_history.create).toHaveBeenCalled();
            expect(prisma.requirement.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'req-1' },
                data: expect.objectContaining({ title: 'Updated Title' })
            }));
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('does not update if no changes detected', async () => {
            req.params.requirementId = 'req-1';
            req.body = { title: 'Old Title' };

            const existing = { id: 'req-1', title: 'Old Title' };
            prisma.requirement.findUnique.mockResolvedValue(existing);

            await requirementsController.updateRequirement(req, res);

            expect(prisma.requirement.update).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe("No changes detected");
        });
    });

    describe('deleteRequirement', () => {
        it('deletes requirement if it exists', async () => {
            req.params.requirementId = 'req-1';
            
            prisma.requirement.findUnique.mockResolvedValue({ id: 'req-1' });
            prisma.requirement.delete.mockResolvedValue({});

            await requirementsController.deleteRequirement(req, res);

            expect(prisma.requirement.delete).toHaveBeenCalledWith({
                where: { id: 'req-1' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 if requirement not found', async () => {
            req.params.requirementId = 'req-missing';
            prisma.requirement.findUnique.mockResolvedValue(null);

            await requirementsController.deleteRequirement(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
