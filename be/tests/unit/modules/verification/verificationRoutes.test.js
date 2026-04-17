import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        post: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        verifyARM: vi.fn(),
        verifyAI: vi.fn(),
        verifyARMRequirement: vi.fn(),
        verifyAIRequirement: vi.fn(),
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

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

vi.mock('../../../../src/modules/verification/verificationController.js', () => mocks.controller);

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/verification/verificationRoutes.js');
    return mod.default;
}

describe('verificationRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.post.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('uses verifyToken globally and exports router', async () => {
        const router = await loadRoutes();

        expect(router).toBe(mocks.router);
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers ARM verification routes', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/arm/:projectId',
            'perm:run_verification_checks',
            mocks.controller.verifyARM,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/arm/:projectId/requirement/:requirementId',
            'perm:run_verification_checks',
            mocks.controller.verifyARMRequirement,
        );
    });

    it('registers AI verification routes', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/ai/:projectId',
            'perm:run_verification_checks',
            mocks.controller.verifyAI,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/ai/:projectId/requirement/:requirementId',
            'perm:run_verification_checks',
            mocks.controller.verifyAIRequirement,
        );
    });

    it('requires permission middleware for each route', async () => {
        await loadRoutes();

        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(4);
        expect(mocks.router.post).toHaveBeenCalledTimes(4);
    });
});
