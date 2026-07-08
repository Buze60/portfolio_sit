import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  try { return !!(await auth())?.user } catch { return false }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const session = await auth()
    const user = await prisma.user.findUnique({ where: { id: session?.user?.id } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const { password, ...profile } = user
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({
      name: "Bizuayehu Simachew",
      title: "Full Stack Developer",
      about: "",
      email: "admin@portfolio.com",
      phone: "",
      location: "",
      image: "",
      socialGithub: "",
      socialLinkedin: "",
      socialTwitter: "",
      socialWebsite: "",
    })
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const session = await auth()
    const data = await request.json()
    const user = await prisma.user.update({ where: { id: session?.user?.id }, data })
    const { password, ...profile } = user
    return NextResponse.json(profile)
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}