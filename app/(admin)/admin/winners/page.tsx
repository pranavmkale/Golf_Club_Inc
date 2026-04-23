import { supabaseAdmin } from "@/lib/supabase/admin"
import type { Winner } from "@/lib/types/database"
import { Trophy } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { createMetadata } from "@/lib/metadata"
import { WinnersTable } from "@/components/admin/winners-table"

export const metadata = createMetadata(
  "Manage Winners",
  "View and verify draw winners and prize distribution."
)

export default async function AdminWinnersPage() {
  const { data: winnersData, error } = await supabaseAdmin
    .from("winners")
    .select("*, profiles(full_name, email), draws(draw_month)")
    .order("created_at", { ascending: false })

  if (error) throw error
  const winners = (winnersData || []) as (Winner & {
    profiles: { full_name: string | null; email: string | null }
    draws: { draw_month: string }
  })[]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Winner Verification"
        description="Validate prize claims and manage payouts."
      />

      <WinnersTable initialWinners={winners} />

      {winners.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-card/10 py-12 text-center text-muted-foreground">
          <Trophy className="mb-2 h-10 w-10 opacity-10" />
          <p className="text-sm italic">
            No prizes recorded yet. The winners circle is waiting.
          </p>
        </div>
      )}
    </div>
  )
}
