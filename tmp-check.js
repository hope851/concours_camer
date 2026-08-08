const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.news.findMany({ take: 1 })
  .then((rows) => {
    console.log('OK', rows.length);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
