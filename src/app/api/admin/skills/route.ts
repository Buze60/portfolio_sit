import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  try {
    const session = await auth()
    return !!session?.user
  } catch {
    return false
  }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(skills)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = await request.json()
    const maxOrder = await prisma.skill.aggregate({ _max: { order: true } })
    const skill = await prisma.skill.create({ data: { ...data, order: (maxOrder._max.order ?? -1) + 1 } })
    return NextResponse.json(skill)
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = await request.json()
    const { id, ...rest } = data
    const skill = await prisma.skill.update({ where: { id }, data: rest })
    return NextResponse.json(skill)
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.skill.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }
}