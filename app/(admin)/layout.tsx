import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { DashboardBreadcrumb } from "@/components/layout/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert } from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Admin Panel",
  "Administrative dashboard for managing users, draws, charities, winners, and viewing analytics."
)

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  return (
    <SidebarProvider>
      <AdminSidebar profile={profile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-1 h-4 self-center! bg-border"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="ml-auto flex items-center gap-3 px-4">
            <Badge
              variant="destructive"
              className="hidden items-center gap-1 text-[10px] tracking-widest uppercase sm:flex"
            >
              <ShieldAlert className="h-3 w-3" />
              Admin Panel
            </Badge>
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 px-8 pb-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
