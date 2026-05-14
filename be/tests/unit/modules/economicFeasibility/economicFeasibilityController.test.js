import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as ecoController from '../../../../src/modules/economicFeasibility/economicFeasibilityController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { runSimulation, computeStatistics } from '../../../../src/modules/economicFeasibility/services/monteCarloEngine.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

vi.mock('../../../../src/modules/economicFeasibility/services/monteCarloEngine.js', () => ({
    runSimulation: vi.fn(),
    computeStatistics: vi.fn()
}));

describe('Economic Feasibility Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
    });

    describe('getConfig', () => {
        it('returns config if exists', async () => {
            const config = { project_id: '1', hourly_rate: 60 };
            prisma.economic_config.findUnique.mockResolvedValue(config);

            await ecoController.getConfig(req, res);

            expect(prisma.economic_config.findUnique).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.config).toEqual(config);
        });

        it('returns default config if none exists', async () => {
            prisma.economic_config.findUnique.mockResolvedValue(null);

            await ecoController.getConfig(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.config.hourly_rate).toBe(50);
            expect(res.jsonData.config.currency).toBe('USD');
        });
    });

    describe('upsertConfig', () => {
        it('creates or updates config', async () => {
            req.body = { hourly_rate: 75, currency: 'EUR', num_developers: 2 };
            prisma.economic_config.upsert.mockResolvedValue({ id: 'c1' });

            await ecoController.upsertConfig(req, res);

            expect(prisma.economic_config.upsert).toHaveBeenCalledWith(expect.objectContaining({
                update: expect.objectContaining({ hourly_rate: 75, currency: 'EUR', num_developers: 2 }),
                create: expect.objectContaining({ hourly_rate: 75, currency: 'EUR', num_developers: 2 })
            }));
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 400 for invalid data', async () => {
            req.body = { hourly_rate: -1, currency: 'USD', num_developers: 2 };

            await ecoController.upsertConfig(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('getEstimates', () => {
        it('returns estimates for a project', async () => {
            prisma.economic_estimate.findMany.mockResolvedValue([{ requirement_id: 'r1' }]);

            await ecoController.getEstimates(req, res);

            expect(prisma.economic_estimate.findMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.estimates.length).toBe(1);
        });
    });

    describe('upsertEstimates', () => {
        it('bulk upserts estimates using a transaction', async () => {
            req.body = { estimates: [
                { requirement_id: 'r1', optimistic_hours: 1, most_likely_hours: 2, pessimistic_hours: 3 }
            ]};
            
            // setup.js automatically mocks transaction to return the mapped array if using array of promises
            prisma.economic_estimate.upsert.mockResolvedValue({ requirement_id: 'r1' });

            await ecoController.upsertEstimates(req, res);

            expect(prisma.economic_estimate.upsert).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.count).toBe(1);
        });

        it('returns 400 if validation fails', async () => {
            req.body = { estimates: [
                { requirement_id: 'r1', optimistic_hours: 5, most_likely_hours: 2, pessimistic_hours: 3 }
            ]};

            await ecoController.upsertEstimates(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('optimistic ≤ most_likely ≤ pessimistic');
        });
    });

    describe('simulate', () => {
        it('runs simulation and computes statistics', async () => {
            prisma.economic_config.findUnique.mockResolvedValue({ num_developers: 2, hourly_rate: 50 });
            prisma.economic_estimate.findMany.mockResolvedValue([{ requirement_id: 'r1' }]);

            runSimulation.mockReturnValue({ costResults: [100, 200], durationResults: [2, 4] });
            computeStatistics.mockReturnValue({ mean: 150 });

            await ecoController.simulate(req, res);

            expect(runSimulation).toHaveBeenCalledWith(expect.objectContaining({
                numDevelopers: 2, hourlyRate: 50, iterations: 10000
            }));
            expect(computeStatistics).toHaveBeenCalledTimes(2);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.simulation.cost.mean).toBe(150);
        });

        it('returns 400 if no config found', async () => {
            prisma.economic_config.findUnique.mockResolvedValue(null);

            await ecoController.simulate(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.jsonData.message).toContain('Please configure project economic settings');
        });
    });
});
