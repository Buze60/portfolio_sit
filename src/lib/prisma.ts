import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const isPostgres = process.env.DATABASE_URL?.startsWith("postgresql")

function createPrismaClient() {
  if (isPostgres) {
    const url = process.env.DATABASE_URL!.includes("?")
      ? `${process.env.DATABASE_URL!}&sslmode=require`
      : `${process.env.DATABASE_URL!}?sslmode=require`
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) })
  }
  return new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' }) })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma