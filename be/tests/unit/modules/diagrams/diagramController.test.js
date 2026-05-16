import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as diagramController from '../../../../src/modules/diagrams/diagramController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { generateStatelessResponse } from '../../../../src/utils/gemini.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Diagram Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
    });

    describe('listDiagrams', () => {
        it('returns all diagrams for a project', async () => {
            const mockDiagrams = [{ id: 'diag-1' }];
            prisma.diagram.findMany.mockResolvedValue(mockDiagrams);

            await diagramController.listDiagrams(req, res);

            expect(prisma.diagram.findMany).toHaveBeenCalledWith({
                where: { project_id: req.params.projectId },
                orderBy: { updated_at: "desc" }
            });
            expect(res.json).toHaveBeenCalledWith({ diagrams: mockDiagrams });
        });
    });

    describe('createDiagram', () => {
        it('creates a new diagram', async () => {
            req.body = { title: 'My Diagram' };
            const newDiag = { id: 'diag-1', title: 'My Diagram' };
            prisma.diagram.create.mockResolvedValue(newDiag);

            await diagramController.createDiagram(req, res);

            expect(prisma.diagram.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ title: 'My Diagram' })
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newDiag);
        });
    });

    describe('getDiagram', () => {
        it('returns a diagram by id', async () => {
            req.params.diagramId = 'diag-1';
            const mockDiag = { id: 'diag-1' };
            prisma.diagram.findFirst.mockResolvedValue(mockDiag);

            await diagramController.getDiagram(req, res);

            expect(prisma.diagram.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'diag-1', project_id: req.params.projectId }
            }));
            expect(res.json).toHaveBeenCalledWith(mockDiag);
        });

        it('returns 404 if diagram not found', async () => {
            req.params.diagramId = 'diag-1';
            prisma.diagram.findFirst.mockResolvedValue(null);

            await diagramController.getDiagram(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateDiagram', () => {
        it('updates diagram fields', async () => {
            req.params.diagramId = 'diag-1';
            req.body = { title: 'New Title', mermaid_code: 'graph TD;' };

            prisma.diagram.updateMany.mockResolvedValue({ count: 1 });
            prisma.diagram.findUnique.mockResolvedValue({ id: 'diag-1', title: 'New Title' });

            await diagramController.updateDiagram(req, res);

            expect(prisma.diagram.updateMany).toHaveBeenCalledWith({
                where: { id: 'diag-1', project_id: req.params.projectId },
                data: expect.objectContaining({ title: 'New Title', mermaid_code: 'graph TD;' })
            });
            expect(res.json).toHaveBeenCalledWith({ id: 'diag-1', title: 'New Title' });
        });
    });

    describe('deleteDiagram', () => {
        it('deletes a diagram', async () => {
            req.params.diagramId = 'diag-1';
            prisma.diagram.deleteMany.mockResolvedValue({ count: 1 });

            await diagramController.deleteDiagram(req, res);

            expect(prisma.diagram.deleteMany).toHaveBeenCalledWith({
                where: { id: 'diag-1', project_id: req.params.projectId }
            });
            expect(res.json).toHaveBeenCalledWith({ message: "Diagram deleted" });
        });
    });

    describe('generateFromDescription', () => {
        it('generates mermaid code from text using Gemini and calculates cycle_time', async () => {
            req.body = { diagram_type: 'Flowchart', requirement_ids: ['req-1', 'req-2'] };
            prisma.requirement.findMany.mockResolvedValue([
                { readable_id: 'REQ-1', title: 'Login', description: 'User can login' },
                { readable_id: 'REQ-2', title: 'Logout', description: 'User can logout' }
            ]);
            generateStatelessResponse.mockResolvedValue('```mermaid\ngraph TD;\n```');

            await diagramController.generateFromDescription(req, res);

            expect(prisma.requirement.findMany).toHaveBeenCalled();
            expect(generateStatelessResponse).toHaveBeenCalledWith(
                expect.stringContaining('Generate a Flowchart based on the following requirements:'),
                expect.any(Object)
            );
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                mermaid_code: 'graph TD;',
                cycle_time: expect.any(Number)
            }));
        });
    });

    describe('editDiagram', () => {
        it('edits mermaid code from instructions using Gemini', async () => {
            req.body = { current_mermaid_code: 'graph TD;', edit_instruction: 'add node' };
            generateStatelessResponse.mockResolvedValue('```\ngraph TD;\nA-->B;\n```');

            await diagramController.editDiagram(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ mermaid_code: 'graph TD;\nA-->B;' });
        });
    });

    describe('updateDiagramRequirements', () => {
        it('updates diagram requirements', async () => {
            req.params.diagramId = 'diag-1';
            req.body = { requirement_ids: ['req-1', 'req-2'] };

            await diagramController.updateDiagramRequirements(req, res);

            expect(prisma.diagram_requirement.deleteMany).toHaveBeenCalledWith({
                where: { diagram_id: 'diag-1' }
            });
            expect(prisma.diagram_requirement.createMany).toHaveBeenCalledWith({
                data: [
                    { diagram_id: 'diag-1', requirement_id: 'req-1' },
                    { diagram_id: 'diag-1', requirement_id: 'req-2' }
                ]
            });
            expect(res.json).toHaveBeenCalledWith({ message: "Requirement links updated" });
        });
    });
});
