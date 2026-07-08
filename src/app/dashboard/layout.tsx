import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/Sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session
  try {
    session = await auth()
  } catch {
    session = null
  }
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      <main className="transition-all duration-300 pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
