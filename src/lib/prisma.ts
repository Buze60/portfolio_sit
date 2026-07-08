import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getUrl() {
  const url = process.env.DATABASE_URL!
  return url.includes("?") ? `${url}&sslmode=require` : `${url}?sslmode=require`
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString: getUrl() }) })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma