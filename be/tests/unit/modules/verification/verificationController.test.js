import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as verificationController from '../../../../src/modules/verification/verificationController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { generateStatelessResponse } from '../../../../src/utils/gemini.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Verification Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
    });

    describe('verifyARM', () => {
        it('calculates ARM metrics for project requirements', async () => {
            const mockReqs = [
                { id: '1', title: 'The system shall do X', description: 'It must be easy.' }
            ];
            prisma.requirement.findMany.mockResolvedValue(mockReqs);

            await verificationController.verifyARM(req, res);

            expect(prisma.requirement.findMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.metrics.imperatives).toBe(2); // 'shall' and 'must'
            expect(res.jsonData.metrics.weakPhrases).toBe(1); // 'easy'
            expect(res.jsonData.results.length).toBe(1);
        });

        it('returns empty results if no requirements', async () => {
            prisma.requirement.findMany.mockResolvedValue([]);
            await verificationController.verifyARM(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.results).toEqual([]);
        });
    });

    describe('verifyARMRequirement', () => {
        it('calculates ARM metrics for a single requirement', async () => {
            req.params.requirementId = '1';
            const mockReq = { id: '1', title: 'System shall', description: 'must do' };
            prisma.requirement.findFirst.mockResolvedValue(mockReq);

            await verificationController.verifyARMRequirement(req, res);

            expect(prisma.requirement.findFirst).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.result.analysis.imperatives).toBe(2);
        });

        it('returns 404 if requirement not found', async () => {
            req.params.requirementId = 'missing';
            prisma.requirement.findFirst.mockResolvedValue(null);

            await verificationController.verifyARMRequirement(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('verifyAI', () => {
        it('evaluates requirements using Gemini in chunks', async () => {
            const mockReqs = [
                { id: 'req-1', title: 'T1', description: 'D1' }
            ];
            prisma.requirement.findMany.mockResolvedValue(mockReqs);

            generateStatelessResponse.mockResolvedValue(JSON.stringify([
                { requirement_id: 'req-1', result: 'Good' }
            ]));

            await verificationController.verifyAI(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.results[0].analysis.result).toBe('Good');
        });
    });

    describe('verifyAIRequirement', () => {
        it('evaluates a single requirement using Gemini', async () => {
            req.params.requirementId = '1';
            const mockReq = { id: '1', title: 'T1', description: 'D1' };
            prisma.requirement.findFirst.mockResolvedValue(mockReq);

            generateStatelessResponse.mockResolvedValue(JSON.stringify({
                requirement_id: '1', result: 'Good'
            }));

            await verificationController.verifyAIRequirement(req, res);

            expect(generateStatelessResponse).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.result.analysis.result).toBe('Good');
        });
    });
});
