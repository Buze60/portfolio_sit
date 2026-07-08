import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { hash } from 'bcryptjs'

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

const prisma = createPrismaClient()

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@portfolio.com' } })
  if (!existingAdmin) {
    const hashedPassword = await hash('admin123', 12)
    await prisma.user.create({
      data: {
        name: 'Bizuayehu Simachew',
        email: 'admin@portfolio.com',
        password: hashedPassword,
        title: 'Full Stack Developer',
        about: 'contact me',
        phone: '+251955227172',
        location: 'Addis Ababa,Ethiopia',
        socialGithub: 'https://github.com/Buze60',
        socialLinkedin: 'https://linkedin.com',
        socialTwitter: 'https://twitter.com',
        socialWebsite: 'https://example.com',
      },
    })
    console.log('Admin user created')
  }

  const sections = [
    { section: 'hero', order: 0, icon: 'User', title: 'Hero' },
    { section: 'skills', order: 1, icon: 'Code2', title: 'Skills' },
    { section: 'experience', order: 2, icon: 'Briefcase', title: 'Experience' },
    { section: 'education', order: 3, icon: 'GraduationCap', title: 'Education' },
    { section: 'projects', order: 4, icon: 'FolderGit2', title: 'Projects' },
    { section: 'achievements', order: 5, icon: 'Award', title: 'Achievements' },
    { section: 'contact', order: 6, icon: 'Mail', title: 'Contact' },
  ]

  for (const section of sections) {
    const existing = await prisma.sectionLayout.findUnique({ where: { section: section.section } })
    if (!existing) {
      await prisma.sectionLayout.create({ data: section })
    }
  }
  console.log('Default sections created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
