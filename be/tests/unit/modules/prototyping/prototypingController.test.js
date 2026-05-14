import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as prototypingController from '../../../../src/modules/prototyping/prototypingController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('Prototyping Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest({
            params: { projectId: '123e4567-e89b-12d3-a456-426614174000' }
        });
        res = createMockResponse();
    });

    describe('getPrototypes', () => {
        it('fetches prototypes with screens', async () => {
            prisma.prototype.findMany.mockResolvedValue([{ id: 'p1' }]);

            await prototypingController.getPrototypes(req, res);

            expect(prisma.prototype.findMany).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ prototypes: [{ id: 'p1' }] });
        });
    });

    describe('createPrototype', () => {
        it('creates a new prototype', async () => {
            req.body = { name: 'V1', description: 'desc' };
            prisma.prototype.create.mockResolvedValue({ id: 'p1', name: 'V1' });

            await prototypingController.createPrototype(req, res);

            expect(prisma.prototype.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ name: 'V1' })
            }));
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updatePrototype', () => {
        it('updates prototype fields', async () => {
            req.params.prototypeId = 'p1';
            req.body = { name: 'V2' };
            prisma.prototype.update.mockResolvedValue({ id: 'p1', name: 'V2' });

            await prototypingController.updatePrototype(req, res);

            expect(prisma.prototype.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'p1' },
                data: expect.objectContaining({ name: 'V2' })
            }));
            expect(res.json).toHaveBeenCalled();
        });
    });

    describe('deletePrototype', () => {
        it('deletes prototype', async () => {
            req.params.prototypeId = 'p1';
            await prototypingController.deletePrototype(req, res);
            expect(prisma.prototype.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
            expect(res.json).toHaveBeenCalledWith({ message: "Prototype deleted" });
        });
    });

    // Screen CRUD
    describe('createScreen', () => {
        it('creates a new screen', async () => {
            req.params.prototypeId = 'p1';
            req.body = { name: 'Home' };

            prisma.prototype_screen.aggregate.mockResolvedValue({ _max: { order: 1 } });
            prisma.prototype_screen.create.mockResolvedValue({ id: 's1', name: 'Home', order: 2 });

            await prototypingController.createScreen(req, res);

            expect(prisma.prototype_screen.aggregate).toHaveBeenCalled();
            expect(prisma.prototype_screen.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ name: 'Home', order: 2 })
            }));
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('reorderScreens', () => {
        it('reorders screens using transaction', async () => {
            req.body = { screenOrders: [{ id: 's1', order: 2 }] };

            prisma.prototype_screen.update.mockResolvedValue({});

            await prototypingController.reorderScreens(req, res);

            expect(prisma.prototype_screen.update).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: "Screens reordered" });
        });
    });

    describe('updateScreenRequirements', () => {
        it('updates screen requirements links', async () => {
            req.params.screenId = 's1';
            req.body = { requirement_ids: ['r1'] };

            await prototypingController.updateScreenRequirements(req, res);

            expect(prisma.screen_requirement.deleteMany).toHaveBeenCalledWith({ where: { screen_id: 's1' } });
            expect(prisma.screen_requirement.create).toHaveBeenCalledWith({
                data: { screen_id: 's1', requirement_id: 'r1' }
            });
            expect(res.json).toHaveBeenCalled();
        });
    });
});
