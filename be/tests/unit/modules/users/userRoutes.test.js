import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        use: vi.fn(),
    };

    const controller = {
        createUser: vi.fn(),
        getAllUsers: vi.fn(),
        getUserByUsername: vi.fn(),
        updateUser: vi.fn(),
        deleteUser: vi.fn(),
        getUsersByIds: vi.fn(),
    };

    const middlewares = {
        verifyToken: vi.fn(),
        requirePermissionsFactory: vi.fn((permission) => `requirePermissions:${permission}`),
        requireFieldFactory: vi.fn((fields) => `requireField:${fields.join('|')}`),
        checkUserExistsFactory: vi.fn((mode) => `checkUserExists:${mode}`),
        validateUserDataInput: vi.fn(),
    };

    return {
        router,
        controller,
        middlewares,
    };
});

vi.mock('express', () => ({
    default: {
        Router: vi.fn(() => mocks.router),
    },
}));

vi.mock('../../../../src/modules/users/userController.js', () => mocks.controller);

vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({
    verifyToken: mocks.middlewares.verifyToken,
}));

vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({
    requirePermissions: mocks.middlewares.requirePermissionsFactory,
}));

vi.mock('../../../../src/middlewares/common/requireFields.js', () => ({
    default: mocks.middlewares.requireFieldFactory,
}));

vi.mock('../../../../src/middlewares/common/checkUserExists.js', () => ({
    default: mocks.middlewares.checkUserExistsFactory,
}));

vi.mock('../../../../src/middlewares/users/inputValidation.js', () => ({
    validateUserDataInput: mocks.middlewares.validateUserDataInput,
}));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/users/userRoutes.js');
    return mod.default;
}

describe('userRoutes', () => {
    beforeEach(() => {
        mocks.router.post.mockClear();
        mocks.router.get.mockClear();
        mocks.router.put.mockClear();
        mocks.router.delete.mockClear();
        mocks.router.use.mockClear();
        mocks.middlewares.requirePermissionsFactory.mockClear();
        mocks.middlewares.requireFieldFactory.mockClear();
        mocks.middlewares.checkUserExistsFactory.mockClear();
    });

    it('exports the express router instance and uses verifyToken', async () => {
        const router = await loadRoutes();
        expect(router).toBe(mocks.router);
        expect(mocks.router.use).toHaveBeenCalledWith(mocks.middlewares.verifyToken);
    });

    it('registers CREATE route correctly', async () => {
        await loadRoutes();

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/create',
            'requirePermissions:add_user',
            'requireField:username|email|password|role|display_name',
            mocks.middlewares.validateUserDataInput,
            'checkUserExists:by-username-email',
            mocks.controller.createUser
        );
    });

    it('registers READ routes correctly', async () => {
        await loadRoutes();

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/all',
            'requirePermissions:view_users',
            mocks.controller.getAllUsers
        );

        expect(mocks.router.post).toHaveBeenCalledWith(
            '/ids',
            'requirePermissions:view_users',
            mocks.controller.getUsersByIds
        );

        expect(mocks.router.get).toHaveBeenCalledWith(
            '/:username',
            'requirePermissions:view_users',
            'checkUserExists:by-username',
            mocks.controller.getUserByUsername
        );
    });

    it('registers UPDATE route correctly', async () => {
        await loadRoutes();

        expect(mocks.router.put).toHaveBeenCalledWith(
            '/:username',
            'requirePermissions:update_user',
            mocks.middlewares.validateUserDataInput,
            'checkUserExists:by-username',
            mocks.controller.updateUser
        );
    });

    it('registers DELETE route correctly', async () => {
        await loadRoutes();

        expect(mocks.router.delete).toHaveBeenCalledWith(
            '/:username',
            'requirePermissions:delete_user',
            'checkUserExists:by-username',
            mocks.controller.deleteUser
        );
    });
});
