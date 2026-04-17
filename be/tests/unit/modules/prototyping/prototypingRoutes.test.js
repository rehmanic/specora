import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = { use: vi.fn(), get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);
    const controller = {
        getPrototypes: vi.fn(), createPrototype: vi.fn(), updatePrototype: vi.fn(), deletePrototype: vi.fn(),
        getScreens: vi.fn(), createScreen: vi.fn(), updateScreen: vi.fn(), deleteScreen: vi.fn(),
        reorderScreens: vi.fn(), getScreenRequirements: vi.fn(), updateScreenRequirements: vi.fn(),
    };
    return { router, verifyToken, requirePermissionsFactory, controller };
});

vi.mock('express', () => ({ default: { Router: vi.fn(() => mocks.router) } }));
vi.mock('../../../../src/modules/prototyping/prototypingController.js', () => mocks.controller);
vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({ verifyToken: mocks.verifyToken }));
vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({ requirePermissions: mocks.requirePermissionsFactory }));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/prototyping/prototypingRoutes.js');
    return mod.default;
}

describe('prototypingRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('registers all prototyping endpoints', async () => {
        await loadRoutes();

        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
        expect(mocks.router.get).toHaveBeenCalledWith('/prototypes/:projectId', 'perm:view_prototypes', mocks.controller.getPrototypes);
        expect(mocks.router.post).toHaveBeenCalledWith('/prototypes/:projectId', 'perm:create_prototype', mocks.controller.createPrototype);
        expect(mocks.router.put).toHaveBeenCalledWith('/prototypes/:prototypeId', 'perm:update_prototype', mocks.controller.updatePrototype);
        expect(mocks.router.delete).toHaveBeenCalledWith('/prototypes/:prototypeId', 'perm:delete_prototype', mocks.controller.deletePrototype);
        expect(mocks.router.get).toHaveBeenCalledWith('/prototypes/:prototypeId/screens', 'perm:view_prototypes', mocks.controller.getScreens);
        expect(mocks.router.post).toHaveBeenCalledWith('/prototypes/:prototypeId/screens', 'perm:manage_prototype_screens', mocks.controller.createScreen);
        expect(mocks.router.put).toHaveBeenCalledWith('/screens/:screenId', 'perm:manage_prototype_screens', mocks.controller.updateScreen);
        expect(mocks.router.delete).toHaveBeenCalledWith('/screens/:screenId', 'perm:manage_prototype_screens', mocks.controller.deleteScreen);
        expect(mocks.router.put).toHaveBeenCalledWith('/screens/reorder', 'perm:manage_prototype_screens', mocks.controller.reorderScreens);
        expect(mocks.router.get).toHaveBeenCalledWith('/screens/:screenId/requirements', 'perm:link_requirements_to_screens', mocks.controller.getScreenRequirements);
        expect(mocks.router.put).toHaveBeenCalledWith('/screens/:screenId/requirements', 'perm:link_requirements_to_screens', mocks.controller.updateScreenRequirements);
    });

    it('creates permission middleware for every route', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(11);
    });
});