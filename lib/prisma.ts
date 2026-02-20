import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config' // <--- Ajoutez ceci impérativement pour charger le .env

const connectionString = process.env.DATABASE_URL

// Vérification de sécurité avant d'instancier le Pool
if (!connectionString || connectionString === 'undefined') {
  console.error("❌ Erreur : DATABASE_URL n'est pas définie dans l'environnement.")
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
