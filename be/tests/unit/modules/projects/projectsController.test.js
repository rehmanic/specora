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
        it('should create a new project successfully', async () => {
            const mockProject = {
                id: 'proj-123',
                name: 'Test Project',
                slug: 'test-project',
                description: 'A test project',
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31'),
                created_by: 'user-123',
                created_at: new Date(),
            };

            prisma.projects.create.mockResolvedValue(mockProject);

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

            expect(prisma.projects.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe('Project created successfully');
        });

        it('should use provided created_by if available', async () => {
            const mockProject = { id: 'proj-123', name: 'Test Project' };
            prisma.projects.create.mockResolvedValue(mockProject);

            const req = createMockRequest({
                body: {
                    name: 'Test Project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                    created_by: 'explicit-user-id',
                },
                user: { userId: 'token-user-id' },
            });
            const res = createMockResponse();

            await createProject(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 500 on error', async () => {
            prisma.projects.create.mockRejectedValue(new Error('DB error'));

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

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getAllProjects', () => {
        it('should return all projects', async () => {
            const mockProjects = [
                { id: '1', name: 'Project 1' },
                { id: '2', name: 'Project 2' },
            ];

            prisma.projects.findMany.mockResolvedValue(mockProjects);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
            expect(res.jsonData.projects).toEqual(mockProjects);
        });

        it('should return empty array when no projects', async () => {
            prisma.projects.findMany.mockResolvedValue([]);

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(0);
        });

        it('should return 500 on error', async () => {
            prisma.projects.findMany.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest();
            const res = createMockResponse();

            await getAllProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('getSingleUserProjects', () => {
        it('should return user projects when userId matches token', async () => {
            const createdProjects = [{ id: '1', name: 'Created Project', created_by: 'user-123', created_at: new Date() }];
            const otherProjects = [{ id: '2', name: 'Member Project', created_by: 'other-user', members: ['user-123'], created_at: new Date() }];

            prisma.projects.findMany
                .mockResolvedValueOnce(createdProjects)
                .mockResolvedValueOnce(otherProjects);

            const req = createMockRequest({
                params: { userId: 'user-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(2);
        });

        it('should return 403 when userId does not match token', async () => {
            const req = createMockRequest({
                params: { userId: 'other-user' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.jsonData.message).toContain('Access denied');
        });

        it('should return empty projects when none found', async () => {
            prisma.projects.findMany
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);

            const req = createMockRequest({
                params: { userId: 'user-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(0);
        });

        it('should return 500 on error', async () => {
            prisma.projects.findMany.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                params: { userId: 'user-123' },
                user: { userId: 'user-123' },
            });
            const res = createMockResponse();

            await getSingleUserProjects(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('updateProject', () => {
        it('should update project successfully', async () => {
            const mockUpdatedProject = {
                id: 'proj-123',
                name: 'Updated Project',
                slug: 'updated-project',
            };

            prisma.projects.update.mockResolvedValue(mockUpdatedProject);

            const req = createMockRequest({
                params: { projectId: 'proj-123' },
                body: {
                    name: 'Updated Project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                },
            });
            const res = createMockResponse();

            await updateProject(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('Project updated successfully');
        });

        it('should return 500 on error', async () => {
            prisma.projects.update.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({
                params: { projectId: 'proj-123' },
                body: {
                    name: 'Updated Project',
                    start_date: '2024-01-01',
                    end_date: '2024-12-31',
                },
            });
            const res = createMockResponse();

            await updateProject(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('deleteProject', () => {
        it('should delete project successfully', async () => {
            prisma.projects.findUnique.mockResolvedValue({ id: 'proj-123', name: 'Test Project' });
            prisma.projects.delete.mockResolvedValue({});

            const req = createMockRequest({ params: { projectId: 'proj-123' } });
            const res = createMockResponse();

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.message).toBe('Project deleted successfully');
        });

        it('should return 404 when project not found', async () => {
            prisma.projects.findUnique.mockResolvedValue(null);

            const req = createMockRequest({ params: { projectId: 'nonexistent' } });
            const res = createMockResponse();

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Project not found');
        });

        it('should return 500 on error', async () => {
            prisma.projects.findUnique.mockRejectedValue(new Error('DB error'));

            const req = createMockRequest({ params: { projectId: 'proj-123' } });
            const res = createMockResponse();

            await deleteProject(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
