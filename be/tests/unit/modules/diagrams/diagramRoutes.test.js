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
        listDiagrams: vi.fn(),
        createDiagram: vi.fn(),
        getDiagram: vi.fn(),
        updateDiagram: vi.fn(),
        deleteDiagram: vi.fn(),
        generateFromDescription: vi.fn(),
        editDiagram: vi.fn(),
        updateDiagramRequirements: vi.fn(),
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

vi.mock('../../../../src/modules/diagrams/diagramController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/diagrams/diagramRoutes.js');
    return mod.default;
}

describe('diagramRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('attaches verifyToken globally', async () => {
        await loadRoutes();
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers all diagram CRUD and generation endpoints', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith('/:projectId', 'perm:view_diagrams', mocks.controller.listDiagrams);
        expect(mocks.router.post).toHaveBeenCalledWith('/:projectId', 'perm:create_diagram', mocks.controller.createDiagram);
        expect(mocks.router.post).toHaveBeenCalledWith('/:projectId/generate', 'perm:create_diagram', mocks.controller.generateFromDescription);
        expect(mocks.router.post).toHaveBeenCalledWith('/:projectId/edit', 'perm:update_diagram', mocks.controller.editDiagram);
        expect(mocks.router.get).toHaveBeenCalledWith('/:projectId/:diagramId', 'perm:view_diagrams', mocks.controller.getDiagram);
        expect(mocks.router.put).toHaveBeenCalledWith('/:projectId/:diagramId', 'perm:update_diagram', mocks.controller.updateDiagram);
        expect(mocks.router.put).toHaveBeenCalledWith(
            '/:projectId/:diagramId/requirements',
            'perm:update_diagram',
            mocks.controller.updateDiagramRequirements,
        );
        expect(mocks.router.delete).toHaveBeenCalledWith('/:projectId/:diagramId', 'perm:delete_diagram', mocks.controller.deleteDiagram);
    });

    it('generates permission middleware for each registered endpoint', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(8);
    });
});
