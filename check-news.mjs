import prisma from './lib/prisma.ts';

try {
  const rows = await prisma.news.findMany({ take: 1 });
  console.log('OK', rows.length);
} catch (e) {
  console.error(e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
