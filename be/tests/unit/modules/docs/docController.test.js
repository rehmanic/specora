import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as docController from '../../../../src/modules/docs/docController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { generateStatelessResponse } from '../../../../src/utils/gemini.js';
import * as docExporter from '../../../../src/utils/docExporter.js';
import { createMockRequest, createMockResponse, createMockNext } from '../../../setup.js';

vi.mock('../../../../src/utils/docExporter.js', () => ({
    generatePDF: vi.fn().mockResolvedValue(Buffer.from('pdf-content')),
    generateDOCX: vi.fn().mockResolvedValue(Buffer.from('docx-content')),
}));

describe('Doc Controller', () => {
    let req, res, next;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
        next = createMockNext();
    });

    describe('createDoc', () => {
        it('creates a new document for a project', async () => {
            req.body = { title: 'New Doc', content: '<p>Hi</p>', type: 'srs' };
            
            // Mock resolveProjectId returning a UUID
            
            prisma.doc.findFirst.mockResolvedValue(null); // no existing srs
            prisma.doc.create.mockResolvedValue({ id: 'doc-1', title: 'New Doc', type: 'srs' });

            await docController.createDoc(req, res, next);

            expect(prisma.doc.create).toHaveBeenCalledWith({
                data: {
                    project_id: '123e4567-e89b-12d3-a456-426614174000',
                    title: 'New Doc',
                    content: '<p>Hi</p>',
                    type: 'srs'
                }
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.status).toBe('success');
        });

        it('returns 400 if trying to create second SRS doc', async () => {
            req.body = { title: 'Second SRS', type: 'srs' };
            
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-existing', type: 'srs' }); // already has srs

            await docController.createDoc(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('only have one SRS document');
        });

        it('returns 400 for invalid document type', async () => {
            req.body = { title: 'Test', type: 'invalid_type' };

            await docController.createDoc(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('Invalid document type');
        });

        it('returns 404 if project not found when resolving slug', async () => {
            req.params.projectId = 'nonexistent-slug';
            prisma.project.findFirst.mockResolvedValue(null);

            await docController.createDoc(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.jsonData.message).toBe('Project not found');
        });
    });

    describe('getDocs', () => {
        it('fetches all docs for a project', async () => {
            prisma.doc.findMany.mockResolvedValue([{ id: 'doc-1' }, { id: 'doc-2' }]);

            await docController.getDocs(req, res, next);

            expect(prisma.doc.findMany).toHaveBeenCalledWith({
                where: { project_id: req.params.projectId },
                orderBy: { updated_at: 'desc' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.results).toBe(2);
        });
    });

    describe('getDocById', () => {
        it('fetches a single document by ID', async () => {
            req.params.id = 'doc-1';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', title: 'Test' });

            await docController.getDocById(req, res, next);

            expect(prisma.doc.findFirst).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.doc.id).toBe('doc-1');
        });

        it('returns 404 if document not found', async () => {
            req.params.id = 'missing';
            prisma.doc.findFirst.mockResolvedValue(null);

            await docController.getDocById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('updateDoc', () => {
        it('updates an existing document', async () => {
            req.params.id = 'doc-1';
            req.body = { title: 'Updated Title', type: 'use_case' };

            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', type: 'use_case' });
            prisma.doc.update.mockResolvedValue({ id: 'doc-1', title: 'Updated Title' });

            await docController.updateDoc(req, res, next);

            expect(prisma.doc.update).toHaveBeenCalledWith({
                where: { id: 'doc-1' },
                data: expect.objectContaining({ title: 'Updated Title', type: 'use_case' })
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteDoc', () => {
        it('deletes a document', async () => {
            req.params.id = 'doc-1';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1' });
            prisma.doc.delete.mockResolvedValue({});

            await docController.deleteDoc(req, res, next);

            expect(prisma.doc.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
            expect(res.status).toHaveBeenCalledWith(204);
        });
    });

    describe('generateDoc', () => {
        it('returns 400 if project has no requirements', async () => {
            req.params.id = 'doc-1';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', type: 'srs' });
            prisma.requirement.findMany.mockResolvedValue([]); // empty requirements

            await docController.generateDoc(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('No requirements found');
        });

        it('generates content using Gemini for SRS', async () => {
            req.params.id = 'doc-1';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', type: 'srs', title: 'Main SRS' });
            prisma.requirement.findMany.mockResolvedValue([
                { title: 'Req 1', priority: 'high' }
            ]);

            generateStatelessResponse.mockResolvedValue('<p>Generated SRS</p>');

            await docController.generateDoc(req, res, next);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.content).toBe('<p>Generated SRS</p>');
        });

        it('generates content using Gemini for Use Case', async () => {
            req.params.id = 'doc-1';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', type: 'use_case', title: 'A Use Case' });
            prisma.requirement.findMany.mockResolvedValue([
                { title: 'Req 1', priority: 'high' }
            ]);
            prisma.doc.findMany.mockResolvedValue([]); // no siblings

            generateStatelessResponse.mockResolvedValue('<table>Generated Use Case</table>');

            await docController.generateDoc(req, res, next);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.content).toBe('<table>Generated Use Case</table>');
        });
    });

    describe('editDocWithAI', () => {
        it('edits a document using Gemini based on instructions', async () => {
            req.params.id = 'doc-1';
            req.body = { editInstructions: 'Make it longer', currentContent: '<p>Hi</p>' };
            
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', type: 'srs', title: 'Doc' });
            generateStatelessResponse.mockResolvedValue('<p>Hi, this is longer</p>');

            await docController.editDocWithAI(req, res, next);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.content).toBe('<p>Hi, this is longer</p>');
        });

        it('returns 400 if no edit instructions provided', async () => {
            req.body = { currentContent: '<p>Hi</p>' };

            await docController.editDocWithAI(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('Edit instructions are required');
        });
    });

    describe('exportDoc', () => {
        it('exports a document to PDF', async () => {
            req.params.id = 'doc-1';
            req.params.format = 'pdf';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', title: 'My Doc' });

            await docController.exportDoc(req, res, next);

            expect(docExporter.generatePDF).toHaveBeenCalled();
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
            expect(res.send).toHaveBeenCalledWith(Buffer.from('pdf-content'));
        });

        it('exports a document to DOCX', async () => {
            req.params.id = 'doc-1';
            req.params.format = 'docx';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', title: 'My Doc' });

            await docController.exportDoc(req, res, next);

            expect(docExporter.generateDOCX).toHaveBeenCalled();
            expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            expect(res.send).toHaveBeenCalledWith(Buffer.from('docx-content'));
        });

        it('returns 400 for unsupported format', async () => {
            req.params.id = 'doc-1';
            req.params.format = 'txt';
            prisma.doc.findFirst.mockResolvedValue({ id: 'doc-1', title: 'My Doc' });

            await docController.exportDoc(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('Unsupported format');
        });
    });
});
