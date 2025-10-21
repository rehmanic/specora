import prisma from './prisma/prismaClient.js';

async function test() {
  try {
    const user = await prisma.users.findMany();
    console.log(user);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
