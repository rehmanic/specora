import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as techController from '../../../../src/modules/technicalFeasibility/techFeasibilityController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

// We need to mock the GoogleGenAI client from the module
vi.mock('@google/genai', () => {
    const generateContentMock = vi.fn();
    return {
        GoogleGenAI: class {
            constructor() {
                this.models = {
                    generateContent: generateContentMock
                };
            }
        },
        _generateContentMock: generateContentMock // Expose for assertions
    };
});

import { _generateContentMock } from '@google/genai';

describe('Technical Feasibility Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
    });

    describe('search', () => {
        it('returns grounded search response', async () => {
            req.body = { query: 'How to build a scalable backend?' };

            prisma.requirement.findMany.mockResolvedValue([
                { title: 'Req 1', description: 'Desc 1' }
            ]);

            const mockGeminiResponse = {
                candidates: [{
                    content: { parts: [{ text: 'Use Node.js' }] },
                    groundingMetadata: {
                        groundingChunks: [{ web: { title: 'Node', uri: 'https://nodejs.org' } }],
                        webSearchQueries: ['scalable backend Node.js']
                    }
                }]
            };
            _generateContentMock.mockResolvedValue(mockGeminiResponse);

            await techController.search(req, res);

            expect(_generateContentMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.answer).toBe('Use Node.js');
            expect(res.jsonData.sources.length).toBe(1);
            expect(res.jsonData.sources[0].title).toBe('Node');
        });

        it('returns 400 if query is missing', async () => {
            req.body = {};

            await techController.search(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('query is required');
        });

        it('handles 503 error properly', async () => {
            req.body = { query: 'Test query' };
            _generateContentMock.mockRejectedValue({ status: 503, message: 'UNAVAILABLE' });

            await techController.search(req, res);

            expect(res.status).toHaveBeenCalledWith(503);
            expect(res.jsonData.message).toContain('experiencing high demand');
        });
    });
});
