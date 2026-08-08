import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

if (!connectionString || connectionString === 'undefined') {
  throw new Error("❌ Erreur : DATABASE_URL n'est pas définie dans l'environnement.")
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// Version standard, ultra-stable pour l'environnement Docker
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
