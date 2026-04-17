/**
 * Projects Controller Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    createProject,
    getAllProjects,
    getSingleUserProjects,
    updateProject,
    deleteProject,
} from '../../../../src/modules/projects/projectsController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Projects Controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createProject', () => {
        it('creates a project when the name is unique', async () => {
            prisma.project.findFirst.mockResolvedValue(null);
            prisma.project.create.mockResolvedValue({ id: 'proj-123', name: 'Test Project' });

            const req = createMockRequest({
                body: {
                    name: 'Test Project',
                    description: 'A test project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await createProject(req, res);

            expect(prisma.project.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe('Project created successfully');
        });

        it('returns 400 when a project with the same name already exists', async () => {
            prisma.project.findFirst.mockResolvedValue({ id: 'existing' });

            const req = createMockRequest({
                body: {
                    name: 'Test Project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await createProject(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toBe('A project with this name already exists');
        });
    });

    describe('getAllProjects', () => {
        it('returns formatted projects', async () => {
            prisma.project.findMany.mockResolvedValue([
                {
                    id: '1',
                    name: 'Project 1',
                    project_member: [{ member_id: 'user-1' }],
                    app_user: { id: 'creator-1', username: 'creator', display_name: 'Creator', profile_pic_url: null },
                },
            ]);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(1);
            expect(res.jsonData.projects[0].members).toEqual(['user-1']);
        });
    });

    describe('getSingleUserProjects', () => {
        it('returns 403 when userId does not match token', async () => {
            const req = createMockRequest({
                params: { userId: 'other-user' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns formatted projects for the current user', async () => {
            prisma.project.findMany.mockResolvedValue([
                {
                    id: '1',
                    name: 'Created Project',
                    created_by: 'user-123',
                    created_at: new Date('2024-01-01'),
                    project_member: [{ member_id: 'user-123' }],
                    app_user: { id: 'user-123', username: 'creator', display_name: 'Creator', profile_pic_url: null },
                },
            ]);
            prisma.project_member.findMany.mockResolvedValue([]);

            const req = createMockRequest({
                params: { userId: 'user-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(1);
        });
    });

    describe('updateProject', () => {
        it('updates a project and its members', async () => {
            prisma.project.update.mockResolvedValue({ id: 'proj-123' });
            prisma.project.findUnique.mockResolvedValue({
                id: 'proj-123',
                name: 'Updated Project',
                project_member: [{ member_id: 'user-123' }],
            });

            const req = createMockRequest({
                params: { projectId: 'proj-123' },
                body: {
                    name: 'Updated Project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                    members: ['user-123'],
                },
            });
            const res = createMockResponse();

            await updateProject(req, res);

            expect(prisma.project.update).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('Project updated successfully');
        });
    });

    describe('deleteProject', () => {
        it('returns 404 when the project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { projectId: 'missing' } });
            const res = createMockResponse();

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Project not found');
        });

        it('deletes an existing project', async () => {
            prisma.project.findUnique.mockResolvedValue({ id: 'proj-123' });
            prisma.project.delete.mockResolvedValue({});

            const req = createMockRequest({ params: { projectId: 'proj-123' } });
            const res = createMockResponse();

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('Project deleted successfully');
        });
    });
});
