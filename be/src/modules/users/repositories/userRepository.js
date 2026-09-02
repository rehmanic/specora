import prisma from "../../../../config/db/prismaClient.js";

const USER_INCLUDES = {
  role: {
    include: {
      role_permission: {
        include: {
          permission: true,
        },
      },
    },
  },
};

export async function findRoleByName(roleName) {
  return await prisma.role.findUnique({
    where: { name: roleName },
  });
}

export async function createUserRecord(data) {
  return await prisma.app_user.create({
    data,
    include: USER_INCLUDES,
  });
}

export async function findAllUsers() {
  return await prisma.app_user.findMany({
    include: {
      ...USER_INCLUDES,
      _count: {
        select: { project_member: true },
      },
    },
  });
}

export async function findUserByUsername(username) {
  return await prisma.app_user.findUnique({
    where: { username },
    include: USER_INCLUDES,
  });
}

export async function findUsersByIds(userIds) {
  return await prisma.app_user.findMany({
    where: { id: { in: userIds } },
    include: USER_INCLUDES,
  });
}

export async function updateUserRecord(username, data) {
  return await prisma.app_user.update({
    where: { username },
    data,
    include: USER_INCLUDES,
  });
}

export async function deleteUserRecord(username) {
  return await prisma.app_user.delete({ where: { username } });
}
