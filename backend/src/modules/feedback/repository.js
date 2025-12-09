import prisma from "../../../prisma/prismaClient.js";

export function create(data) {
  return prisma.feedbacks.create({ data });
}

export function findAll() {
  return prisma.feedbacks.findMany();
}

export function findById(id) {
  return prisma.feedbacks.findUnique({ where: { id } });
}

export function update(id, data) {
  return prisma.feedbacks.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.feedbacks.delete({ where: { id } });
}
