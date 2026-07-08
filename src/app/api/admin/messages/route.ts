import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function isAuthenticated() {
  try { return !!(await auth())?.user } catch { return false }
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(messages)
  } catch { return NextResponse.json([]) }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id, read } = await request.json()
    const message = await prisma.message.update({ where: { id }, data: { read } })
    return NextResponse.json(message)
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}

export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await request.json()
    await prisma.message.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}