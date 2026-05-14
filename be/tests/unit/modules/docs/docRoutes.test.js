import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const routeChains = new Map();

    const createRouteChain = (path) => {
        const chain = {
            get: vi.fn(() => chain),
            post: vi.fn(() => chain),
            put: vi.fn(() => chain),
            delete: vi.fn(() => chain),
        };
        routeChains.set(path, chain);
        return chain;
    };

    const router = {
        use: vi.fn(),
        route: vi.fn((path) => createRouteChain(path)),
        put: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
    };

    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);

    const controller = {
        getDocs: vi.fn(),
        createDoc: vi.fn(),
        getDocById: vi.fn(),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
        updateDocRequirements: vi.fn(),
        generateDoc: vi.fn(),
        editDocWithAI: vi.fn(),
        exportDoc: vi.fn(),
    };

    return {
        router,
        routeChains,
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

vi.mock('../../../../src/modules/docs/docController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/docs/docRoutes.js');
    return mod.default;
}

describe('docRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.route.mockClear();
        mocks.router.put.mockReset();
        mocks.routeChains.clear();
        mocks.requirePermissionsFactory.mockClear();
    });

    it('exports router and attaches global verifyToken middleware', async () => {
        const router = await loadRoutes();
        expect(router).toBe(mocks.router);
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('creates merged router and chained routes for / and /:id', async () => {
        await loadRoutes();

        expect(mocks.router.route).toHaveBeenNthCalledWith(1, '/');
        expect(mocks.router.route).toHaveBeenNthCalledWith(2, '/:id');

        const rootChain = mocks.routeChains.get('/');
        const idChain = mocks.routeChains.get('/:id');

        expect(rootChain.get).toHaveBeenCalledWith('perm:view_documents', mocks.controller.getDocs);
        expect(rootChain.post).toHaveBeenCalledWith('perm:create_document', mocks.controller.createDoc);

        expect(idChain.get).toHaveBeenCalledWith('perm:view_documents', mocks.controller.getDocById);
        expect(idChain.put).toHaveBeenCalledWith('perm:update_document', mocks.controller.updateDoc);
        expect(idChain.delete).toHaveBeenCalledWith('perm:delete_document', mocks.controller.deleteDoc);
    });

    it('registers requirements update endpoint', async () => {
        await loadRoutes();

        expect(mocks.router.put).toHaveBeenCalledWith(
            '/:id/requirements',
            'perm:update_document',
            mocks.controller.updateDocRequirements,
        );
    });

    it('registers AI and export endpoints', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:id/generate',
            'perm:update_document',
            mocks.controller.generateDoc,
        );

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:id/edit-with-ai',
            'perm:update_document',
            mocks.controller.editDocWithAI,
        );

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:id/export/:format',
            'perm:view_documents',
            mocks.controller.exportDoc,
        );
    });

    it('builds permission middleware for every protected action', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(9);
    });
});
