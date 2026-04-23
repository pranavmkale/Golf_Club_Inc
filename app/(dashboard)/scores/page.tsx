import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Score } from "@/lib/types/database"
import { DrawEligibilityBanner } from "@/components/scores/draw-eligibility-banner"
import { ScoreHistoryList } from "@/components/scores/score-history-list"
import { PageHeader } from "@/components/layout/page-header"
import { ScoreEntryDialog } from "@/components/scores/score-entry-dialog"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Score History",
  "Enter and view your Stableford scores. More scores mean more draw entries and higher winning chances."
)

export default async function ScoresPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: scores }] = await Promise.all([
    supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("played_on", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ])

  const safeScores: Score[] = scores ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Scores"
        description="Your rolling 5-score history. Most recent scores count toward the monthly draw."
      >
        <ScoreEntryDialog />
      </PageHeader>

      <DrawEligibilityBanner
        scoreCount={safeScores.length}
        scores={safeScores}
      />

      <ScoreHistoryList scores={safeScores} />
    </div>
  )
}
