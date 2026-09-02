import prisma from "../../../config/db/prismaClient.js";

// ─── ROLES ────────────────────────────────────────────────

export async function findAllRoles() {
    return await prisma.role.findMany({
        include: {
            role_permission: {
                include: { permission: true },
            },
        },
    });
}

export async function findRoleById(id) {
    return await prisma.role.findUnique({
        where: { id },
        include: {
            role_permission: {
                include: { permission: true },
            },
        },
    });
}

export async function createRoleWithPermissions(name, permissionIds) {
    return await prisma.$transaction(async (tx) => {
        const newRole = await tx.role.create({ data: { name } });

        if (permissionIds && permissionIds.length > 0) {
            await tx.role_permission.createMany({
                data: permissionIds.map((pId) => ({
                    role_id: newRole.id,
                    permission_id: pId,
                })),
            });
        }
        return newRole;
    });
}

export async function updateRole(id, name) {
    return await prisma.role.update({
        where: { id },
        data: { name },
    });
}

export async function deleteRoleTransaction(id) {
    return await prisma.$transaction([
        prisma.role_permission.deleteMany({ where: { role_id: id } }),
        prisma.role.delete({ where: { id } }),
    ]);
}

// ─── PERMISSIONS ──────────────────────────────────────────

export async function findAllPermissions() {
    return await prisma.permission.findMany();
}

export async function findPermissionById(id) {
    return await prisma.permission.findUnique({ where: { id } });
}

export async function createPermission(data) {
    return await prisma.permission.create({ data });
}

export async function updatePermission(id, data) {
    return await prisma.permission.update({
        where: { id },
        data,
    });
}

export async function deletePermissionTransaction(id) {
    return await prisma.$transaction([
        prisma.role_permission.deleteMany({ where: { permission_id: id } }),
        prisma.permission.delete({ where: { id } }),
    ]);
}

// ─── ROLE-PERMISSION ASSIGNMENT ───────────────────────────

export async function createRolePermission(roleId, permissionId) {
    return await prisma.role_permission.create({
        data: { role_id: roleId, permission_id: permissionId },
        include: { permission: true },
    });
}

export async function findRolePermission(roleId, permissionId) {
    return await prisma.role_permission.findFirst({
        where: { role_id: roleId, permission_id: permissionId },
    });
}

export async function deleteRolePermissionById(id) {
    return await prisma.role_permission.delete({ where: { id } });
}
