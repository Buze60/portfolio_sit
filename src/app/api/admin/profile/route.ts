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
    let user = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id } })
      : null
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } })
    }
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const { password, ...profile } = user
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const session = await auth()
    let user = session?.user?.id
      ? await prisma.user.findUnique({ where: { id: session.user.id } })
      : null
    if (!user && session?.user?.email) {
      user = await prisma.user.findUnique({ where: { email: session.user.email } })
    }
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    const data = await request.json()
    const updated = await prisma.user.update({ where: { id: user.id }, data })
    const { password, ...profile } = updated
    return NextResponse.json(profile)
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}
