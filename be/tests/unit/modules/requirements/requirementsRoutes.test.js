import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        getProjectRequirements: vi.fn(),
        createRequirement: vi.fn(),
        importRequirements: vi.fn(),
        updateRequirement: vi.fn(),
        deleteRequirement: vi.fn(),
        getRequirementHistory: vi.fn(),
        rollbackRequirement: vi.fn(),
        getComments: vi.fn(),
        addComment: vi.fn(),
        getTraceabilityLinks: vi.fn(),
        createTraceabilityLink: vi.fn(),
        deleteTraceabilityLink: vi.fn(),
        getProjectTraceabilityGraph: vi.fn(),
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

vi.mock('../../../../src/modules/requirements/requirementsController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/requirements/requirementsRoutes.js');
    return mod.default;
}

describe('requirementsRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('uses verifyToken middleware globally', async () => {
        await loadRoutes();
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers core CRUD routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith('/:projectId', 'perm:view_requirements', mocks.controller.getProjectRequirements);
        expect(mocks.router.post).toHaveBeenCalledWith('/:projectId', 'perm:create_requirement', mocks.controller.createRequirement);
        expect(mocks.router.post).toHaveBeenCalledWith('/:projectId/import', 'perm:import_requirement', mocks.controller.importRequirements);
        expect(mocks.router.put).toHaveBeenCalledWith('/:projectId/:requirementId', 'perm:update_requirement', mocks.controller.updateRequirement);
        expect(mocks.router.delete).toHaveBeenCalledWith('/:projectId/:requirementId', 'perm:delete_requirement', mocks.controller.deleteRequirement);
    });

    it('registers history and rollback routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/:requirementId/history',
            'perm:view_requirement_history',
            mocks.controller.getRequirementHistory,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:projectId/:requirementId/rollback/:historyId',
            'perm:rollback_requirement',
            mocks.controller.rollbackRequirement,
        );
    });

    it('registers comments and traceability routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/:requirementId/comments',
            'perm:view_requirement_comments',
            mocks.controller.getComments,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:projectId/:requirementId/comments',
            'perm:comment_on_requirements',
            mocks.controller.addComment,
        );
        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/:requirementId/traceability',
            'perm:view_requirements',
            mocks.controller.getTraceabilityLinks,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:projectId/:requirementId/traceability',
            'perm:manage_requirement_dependencies',
            mocks.controller.createTraceabilityLink,
        );
        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/:projectId/traceability/:linkId',
            'perm:manage_requirement_dependencies',
            mocks.controller.deleteTraceabilityLink,
        );
        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/traceability/graph',
            'perm:view_requirement_graph',
            mocks.controller.getProjectTraceabilityGraph,
        );
    });

    it('creates permission middleware for every route', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(13);
    });
});
