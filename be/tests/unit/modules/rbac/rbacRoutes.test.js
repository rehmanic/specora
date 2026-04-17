import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
    const router = { use: vi.fn(), get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
    const verifyToken = vi.fn();
    const requirePermissionsFactory = vi.fn((permission) => `perm:${permission}`);
    const requireFieldFactory = vi.fn((fields) => `fields:${fields.join('|')}`);
    const controller = {
        getAllRoles: vi.fn(),
        getRoleById: vi.fn(),
        createRole: vi.fn(),
        updateRole: vi.fn(),
        deleteRole: vi.fn(),
        getAllPermissions: vi.fn(),
        getPermissionById: vi.fn(),
        createPermission: vi.fn(),
        updatePermission: vi.fn(),
        deletePermission: vi.fn(),
        assignPermissionToRole: vi.fn(),
        removePermissionFromRole: vi.fn(),
    };
    return { router, verifyToken, requirePermissionsFactory, requireFieldFactory, controller };
});

vi.mock('express', () => ({ default: { Router: vi.fn(() => mocks.router) } }));
vi.mock('../../../../src/modules/rbac/rbacController.js', () => mocks.controller);
vi.mock('../../../../src/middlewares/common/verifyToken.js', () => ({ verifyToken: mocks.verifyToken }));
vi.mock('../../../../src/middlewares/common/requirePermissions.js', () => ({ requirePermissions: mocks.requirePermissionsFactory }));
vi.mock('../../../../src/middlewares/common/requireFields.js', () => ({ default: mocks.requireFieldFactory }));

async function loadRoutes() {
    vi.resetModules();
    const mod = await import('../../../../src/modules/rbac/rbacRoutes.js');
    return mod.default;
}

describe('rbacRoutes', () => {
    beforeEach(() => {
        mocks.router.use.mockReset();
        mocks.router.get.mockReset();
        mocks.router.post.mockReset();
        mocks.router.put.mockReset();
        mocks.router.delete.mockReset();
        mocks.requirePermissionsFactory.mockClear();
        mocks.requireFieldFactory.mockClear();
    });

    it('registers all RBAC routes and public permissions list', async () => {
        await loadRoutes();

        expect(mocks.router.use).toHaveBeenCalledWith(mocks.verifyToken);
        expect(mocks.router.get).toHaveBeenCalledWith('/roles', 'perm:view_roles', mocks.controller.getAllRoles);
        expect(mocks.router.get).toHaveBeenCalledWith('/permissions', mocks.controller.getAllPermissions);
        expect(mocks.router.post).toHaveBeenCalledWith('/roles', 'perm:create_role', 'fields:name', mocks.controller.createRole);
        expect(mocks.router.post).toHaveBeenCalledWith('/permissions', 'perm:create_role', 'fields:name', mocks.controller.createPermission);
        expect(mocks.router.post).toHaveBeenCalledWith('/roles/:roleId/permissions', 'perm:update_role', 'fields:permissionId', mocks.controller.assignPermissionToRole);
        expect(mocks.router.delete).toHaveBeenCalledWith('/roles/:roleId/permissions/:permissionId', 'perm:update_role', mocks.controller.removePermissionFromRole);
    });

    it('creates permission and field middleware for each protected route', async () => {
        await loadRoutes();
        expect(mocks.requirePermissionsFactory).toHaveBeenCalledTimes(11);
        expect(mocks.requireFieldFactory).toHaveBeenCalledTimes(5);
    });
});