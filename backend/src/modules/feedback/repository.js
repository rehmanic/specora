import prisma from "../../../prisma/prismaClient.js";

export function create(data) {
  return prisma.feedback.create({ data });
}

export function findAll() {
  return prisma.feedback.findMany();
}

export function findById(id) {
  return prisma.feedback.findUnique({ where: { id } });
}

export function update(id, data) {
  return prisma.feedback.update({ where: { id }, data });
}

export function remove(id) {
  return prisma.feedback.delete({ where: { id } });
}
