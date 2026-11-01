import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString || connectionString === 'undefined') {
  throw new Error("❌ Erreur : DATABASE_URL n'est pas définie dans l'environnement.")
}

declare global {
  var prisma: PrismaClient | undefined
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const basePrisma = globalThis.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = basePrisma
}

const prisma = basePrisma

export default prisma

