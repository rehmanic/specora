import prisma from '../prisma/prismaClient.js';

async function check() {
  try {
    await prisma.$connect();
    const res = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'feedbacks'`;
    console.log('pg_tables query result:', res);
    if (res && res.length && res[0].tablename === 'feedbacks') {
      console.log('✅ Table `public.feedbacks` exists.');
    } else {
      console.log('❌ Table `public.feedbacks` does not exist.');
      process.exitCode = 2;
    }
  } catch (err) {
    console.error('Error checking table:', err.message || err);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
}

check();
