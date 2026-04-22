import { supabaseAdmin } from "@/lib/supabase/admin"
import type { Profile } from "@/lib/types/database"
import { PageHeader } from "@/components/layout/page-header"
import { UsersTable } from "./components/users-table"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Manage Users",
  "View and manage user accounts, subscription status, and search users."
)

export default async function AdminUsersPage() {
  const { data: usersData, error } = await supabaseAdmin
    .from("profiles")
    .select("*, charities(name)")
    .order("created_at", { ascending: false })

  if (error) throw error
  const users = (usersData || []) as (Profile & { charities: { name: string } | null })[]

  // Fetch total score counts per user for the table
  const { data: scoreDataResult } = await supabaseAdmin
    .from("scores")
    .select("user_id")

  const scoreCounts: Record<string, number> = {}
  const scoreData = (scoreDataResult || []) as { user_id: string }[]
  scoreData.forEach((s) => {
    scoreCounts[s.user_id] = (scoreCounts[s.user_id] || 0) + 1
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Audit and manage platform participants."
      />

      <UsersTable users={users} scoreCounts={scoreCounts} />
    </div>
  )
}
