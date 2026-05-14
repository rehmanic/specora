import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as feedbacksController from '../../../../src/modules/feedbacks/feedbacksController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Feedbacks Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            user: { userId: 'user-1', role: 'manager' }
        });
        res = createMockResponse();
    });

    describe('createFeedback', () => {
        it('creates a new feedback form if user is member', async () => {
            req.body = { projectId: 'project-slug', title: 'Test Form', description: 'Desc', formStructure: {} };
            
            prisma.project.findFirst.mockResolvedValue({ id: 'proj-1', created_by: 'user-2' });
            prisma.project_member.findFirst.mockResolvedValue({ member_id: 'user-1' });
            prisma.feedback.create.mockResolvedValue({ id: 'fb-1', title: 'Test Form' });

            await feedbacksController.createFeedback(req, res);

            expect(prisma.feedback.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ title: 'Test Form' })
            }));
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('returns 403 if user is not member and not creator', async () => {
            req.body = { projectId: 'project-slug', title: 'Test Form' };
            prisma.project.findFirst.mockResolvedValue({ id: 'proj-1', created_by: 'user-2' });
            prisma.project_member.findFirst.mockResolvedValue(null);

            await feedbacksController.createFeedback(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(prisma.feedback.create).not.toHaveBeenCalled();
        });
    });

    describe('getProjectFeedbacks', () => {
        it('fetches all feedbacks for a project', async () => {
            req.params.projectId = 'proj-1';
            prisma.project.findFirst.mockResolvedValue({ id: 'proj-1', created_by: 'user-1' }); // user is creator
            prisma.feedback.findMany.mockResolvedValue([{ id: 'fb-1' }]);

            await feedbacksController.getProjectFeedbacks(req, res);

            expect(prisma.feedback.findMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.feedbacks.length).toBe(1);
        });
    });

    describe('submitResponse', () => {
        it('creates a new response if none exists', async () => {
            req.params.feedbackId = 'fb-1';
            req.body = { response: { q1: 'ans1' } };

            prisma.feedback.findUnique.mockResolvedValue({ id: 'fb-1', project_id: 'proj-1', project: { created_by: 'user-1' } });
            prisma.feedback_response.findFirst.mockResolvedValue(null);
            prisma.feedback_response.create.mockResolvedValue({ id: 'resp-1' });

            await feedbacksController.submitResponse(req, res);

            expect(prisma.feedback_response.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('updates an existing response if one exists', async () => {
            req.params.feedbackId = 'fb-1';
            req.body = { response: { q1: 'new-ans' } };

            prisma.feedback.findUnique.mockResolvedValue({ id: 'fb-1', project_id: 'proj-1', project: { created_by: 'user-1' } });
            prisma.feedback_response.findFirst.mockResolvedValue({ id: 'resp-1' });
            prisma.feedback_response.update.mockResolvedValue({ id: 'resp-1' });

            await feedbacksController.submitResponse(req, res);

            expect(prisma.feedback_response.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteFeedback', () => {
        it('deletes feedback', async () => {
            req.params.feedbackId = 'fb-1';
            await feedbacksController.deleteFeedback(req, res);
            expect(prisma.feedback.delete).toHaveBeenCalledWith({ where: { id: 'fb-1' } });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
