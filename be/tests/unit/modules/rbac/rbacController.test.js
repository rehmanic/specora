import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as rbacController from '../../../../src/modules/rbac/rbacController.js';
import prisma from '../../../../config/db/prismaClient.js';
import { createMockRequest, createMockResponse } from '../../../setup.js';

describe('RBAC Controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        req = createMockRequest();
        res = createMockResponse();
    });

    describe('getAllRoles', () => {
        it('returns formatted roles', async () => {
            prisma.role.findMany.mockResolvedValue([
                { id: '1', name: 'admin', role_permission: [{ permission: { id: 'p1', name: 'read' } }] }
            ]);

            await rbacController.getAllRoles(req, res);

            expect(prisma.role.findMany).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData).toEqual({
                roles: [{ id: '1', name: 'admin', permissions: [{ id: 'p1', name: 'read' }] }]
            });
        });
    });

    describe('getRoleById', () => {
        it('returns role by id', async () => {
            req.params.id = '1';
            prisma.role.findUnique.mockResolvedValue({
                id: '1', name: 'admin', role_permission: [{ permission: { id: 'p1', name: 'read' } }]
            });

            await rbacController.getRoleById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.jsonData.role.name).toBe('admin');
        });

        it('returns 404 if role not found', async () => {
            req.params.id = 'missing';
            prisma.role.findUnique.mockResolvedValue(null);

            await rbacController.getRoleById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createRole', () => {
        it('creates a role inside a transaction', async () => {
            req.body = { name: 'manager', permissionIds: ['p1', 'p2'] };
            const newRole = { id: 'r1', name: 'manager' };

            // When $transaction is called, it passes the prisma mock as `tx` (handled in setup.js)
            prisma.role.create.mockResolvedValue(newRole);

            await rbacController.createRole(req, res);

            expect(prisma.role.create).toHaveBeenCalledWith({ data: { name: 'manager' } });
            expect(prisma.role_permission.createMany).toHaveBeenCalledWith({
                data: [
                    { role_id: 'r1', permission_id: 'p1' },
                    { role_id: 'r1', permission_id: 'p2' }
                ]
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.jsonData.message).toBe("Role created successfully");
        });
    });

    describe('updateRole', () => {
        it('updates role name', async () => {
            req.params.id = 'r1';
            req.body = { name: 'new-name' };
            prisma.role.update.mockResolvedValue({ id: 'r1', name: 'new-name' });

            await rbacController.updateRole(req, res);

            expect(prisma.role.update).toHaveBeenCalledWith({
                where: { id: 'r1' },
                data: { name: 'new-name' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteRole', () => {
        it('deletes role and role_permissions', async () => {
            req.params.id = 'r1';

            await rbacController.deleteRole(req, res);

            expect(prisma.role_permission.deleteMany).toHaveBeenCalledWith({
                where: { role_id: 'r1' }
            });
            expect(prisma.role.delete).toHaveBeenCalledWith({
                where: { id: 'r1' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    // PERMISSIONS tests
    describe('getAllPermissions', () => {
        it('returns all permissions', async () => {
            prisma.permission.findMany.mockResolvedValue([{ id: 'p1' }]);
            await rbacController.getAllPermissions(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createPermission', () => {
        it('creates a permission', async () => {
            req.body = { name: 'write', label: 'Write', description: 'desc', module: 'core' };
            prisma.permission.create.mockResolvedValue({ id: 'p1' });

            await rbacController.createPermission(req, res);

            expect(prisma.permission.create).toHaveBeenCalledWith({
                data: { name: 'write', label: 'Write', description: 'desc', module: 'core' }
            });
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('assignPermissionToRole', () => {
        it('assigns permission to role', async () => {
            req.params.roleId = 'r1';
            req.body = { permissionId: 'p1' };

            await rbacController.assignPermissionToRole(req, res);

            expect(prisma.role_permission.create).toHaveBeenCalledWith(expect.objectContaining({
                data: { role_id: 'r1', permission_id: 'p1' }
            }));
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('removePermissionFromRole', () => {
        it('removes permission from role', async () => {
            req.params = { roleId: 'r1', permissionId: 'p1' };
            prisma.role_permission.findFirst.mockResolvedValue({ id: 'rp1' });

            await rbacController.removePermissionFromRole(req, res);

            expect(prisma.role_permission.delete).toHaveBeenCalledWith({
                where: { id: 'rp1' }
            });
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
