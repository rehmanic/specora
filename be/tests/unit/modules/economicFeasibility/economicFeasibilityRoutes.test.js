import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        getConfig: vi.fn(),
        upsertConfig: vi.fn(),
        getEstimates: vi.fn(),
        upsertEstimates: vi.fn(),
        simulate: vi.fn(),
    };

    return {
        router,
        verifyToken,
        requirePermissionsFactory,
        controller,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/economicFeasibility/economicFeasibilityController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/economicFeasibility/economicFeasibilityRoutes.js');
    return mod.default;
}

describe('economicFeasibilityRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.get.mockReset();
        mocks.router.put.mockReset();
        mocks.router.post.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('registers verifyToken globally', async () => {
        await loadRoutes();
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers config, estimates and simulation routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith('/config/:projectId', 'perm:view_feasibility_studies', mocks.controller.getConfig);
        expect(mocks.router.put).toHaveBeenCalledWith('/config/:projectId', 'perm:manage_economic_config', mocks.controller.upsertConfig);

        expect(mocks.router.get).toHaveBeenCalledWith('/estimates/:projectId', 'perm:view_feasibility_studies', mocks.controller.getEstimates);
        expect(mocks.router.put).toHaveBeenCalledWith('/estimates/:projectId', 'perm:manage_economic_estimates', mocks.controller.upsertEstimates);

        expect(mocks.router.post).toHaveBeenCalledWith('/simulate/:projectId', 'perm:run_economic_simulations', mocks.controller.simulate);
    });

    it('creates permission middleware for all routes', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(5);
    });
});
