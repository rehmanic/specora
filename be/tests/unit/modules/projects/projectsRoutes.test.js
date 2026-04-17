import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        use: vi.fn(),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    };

    const verifyToken = vi.fn();
    const validateProjectDataInput = vi.fn();

    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);
    const requireFieldsFactory = vi.fn((fields) => `fields:${fields.join('|')}`);
    const checkProjectExistsFactory = vi.fn((mode) => `projectExists:${mode}`);

    const controller = {
        createProject: vi.fn(),
        getAllProjects: vi.fn(),
        getSingleUserProjects: vi.fn(),
        updateProject: vi.fn(),
        deleteProject: vi.fn(),
        getProjectMembers: vi.fn(),
        addProjectMember: vi.fn(),
        removeProjectMember: vi.fn(),
        getProjectTags: vi.fn(),
        addProjectTag: vi.fn(),
        removeProjectTag: vi.fn(),
    };

    return {
        router,
        verifyToken,
        validateProjectDataInput,
        requirePermissionsFactory,
        requireFieldsFactory,
        checkProjectExistsFactory,
        controller,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/projects/projectsController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.requirePermissionsFactory,
}));

vi.mock('../../../../src/middlewares/common/requireFields.js', () => ({
    default: mocks.requireFieldsFactory,
}));

vi.mock('../../../../src/middlewares/projects/inputValidation.js', () => ({
    validateProjectDataInput: mocks.validateProjectDataInput,
}));

vi.mock('../../../../src/middlewares/projects/checkProjectExists.js', () => ({
    default: mocks.checkProjectExistsFactory,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/projects/projectsRoutes.js');
    return mod.default;
}

describe('projectsRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.post.mockReset();
        mocks.router.get.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
        mocks.requireFieldsFactory.mockClear();
        mocks.checkProjectExistsFactory.mockClear();
    });

    it('uses verifyToken as global middleware', async () => {
        await loadRoutes();
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
    });

    it('registers create route with validation middleware chain', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenNthCalledWith(
            1,
            '/',
            'perm:create_project',
            'fields:name|start_date|end_date',
            mocks.validateProjectDataInput,
            'projectExists:create',
            mocks.controller.createProject,
        );
    });

    it('registers update route with validation middleware chain', async () => {
        await loadRoutes();

        expect(mocks.router.put).toHaveBeenCalledWith(
            '/:projectId',
            'perm:update_project',
            'fields:name|start_date|end_date',
            mocks.validateProjectDataInput,
            'projectExists:update',
            mocks.controller.updateProject,
        );
    });

    it('registers members and tags management routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/members',
            'perm:view_project_members',
            mocks.controller.getProjectMembers,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:projectId/members',
            'perm:add_project_member',
            mocks.controller.addProjectMember,
        );
        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/:projectId/members/:memberId',
            'perm:remove_project_member',
            mocks.controller.removeProjectMember,
        );

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:projectId/tags',
            'perm:view_project_tags',
            mocks.controller.getProjectTags,
        );
        expect(mocks.router.post).toHaveBeenCalledWith(
            '/:projectId/tags',
            'perm:add_project_tag',
            mocks.controller.addProjectTag,
        );
        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/:projectId/tags/:tag',
            'perm:remove_project_tag',
            mocks.controller.removeProjectTag,
        );
    });

    it('registers expected core CRUD routes', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith('/all', 'perm:view_projects', mocks.controller.getAllProjects);
        expect(mocks.router.get).toHaveBeenCalledWith('/:userId', 'perm:view_projects', mocks.controller.getSingleUserProjects);
        expect(mocks.router.delete).toHaveBeenCalledWith('/:projectId', 'perm:delete_project', mocks.controller.deleteProject);
    });

    it('creates permission middleware for all protected routes', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(11);
    });
});
