import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

async function getAuthUser() {
  try {
    const session = await auth()
    console.log("Profile auth session:", JSON.stringify(session, null, 2))
    const email = session?.user?.email
    if (!email) {
      console.log("No email in session, user:", session?.user)
      return null
    }
    const user = await prisma.user.findUnique({ where: { email } })
    return user
  } catch (e) {
    console.error("getAuthUser error:", e)
    return null
  }
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { password, ...profile } = user
  return NextResponse.json(profile)
}

export async function PUT(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = await request.json()
    const updated = await prisma.user.update({ where: { id: user.id }, data })
    const { password, ...profile } = updated
    return NextResponse.json(profile)
  } catch { return NextResponse.json({ error: "Database error" }, { status: 500 }) }
}
