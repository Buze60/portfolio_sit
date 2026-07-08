import { NextResponse } from "next/server"
import { execSync } from "child_process"

let done = false

export async function GET() {
  if (done) return NextResponse.json({ message: "already done" })
  const results: string[] = []

  try {
    const push = execSync("npx prisma db push --accept-data-loss", { encoding: "utf8", cwd: process.cwd() })
    results.push(push)
  } catch (e: any) {
    results.push("PUSH FAILED: " + (e?.stderr || e?.message || String(e)))
    return NextResponse.json({ results }, { status: 500 })
  }

  try {
    const seed = execSync("npx tsx prisma/seed.ts", { encoding: "utf8", cwd: process.cwd() })
    results.push(seed)
  } catch (e: any) {
    results.push("SEED FAILED: " + (e?.stderr || e?.message || String(e)))
    return NextResponse.json({ results }, { status: 500 })
  }

  done = true
  return NextResponse.json({ message: "database initialised", results })
}
