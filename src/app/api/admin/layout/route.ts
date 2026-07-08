import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  try { return !!(await auth())?.user } catch { return false }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const layouts = await prisma.sectionLayout.findMany({ orderBy: { order: "asc" } })
    return NextResponse.json(layouts)
  } catch {
    return NextResponse.json([])
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = await request.json()
    const layout = await prisma.sectionLayout.update({ where: { id: data.id }, data })
    return NextResponse.json(layout)
  } catch {
    return NextResponse.json({ error: "Failed to update layout" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { layouts } = await request.json()
    for (const layout of layouts) {
      await prisma.sectionLayout.update({ where: { id: layout.id }, data: { order: layout.order } })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to reorder layouts" }, { status: 500 })
  }
}
