import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        post: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);
    const search = vi.fn();

    return {
        router,
        verifyToken,
        requirePermissionsFactory,
        search,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/technicalFeasibility/techFeasibilityController.js', () => ({
    search: mocks.search,
}));

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/technicalFeasibility/techFeasibilityRoutes.js');
    return mod.default;
}

describe('techFeasibilityRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.post.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('uses verifyToken globally', async () => {
        await loadRoutes();
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers search endpoint with permission middleware', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/search/:projectId',
            'perm:view_technical_feasibility',
            mocks.search,
        );
    });

    it('creates exactly one permission middleware instance', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(1);
    });
});
