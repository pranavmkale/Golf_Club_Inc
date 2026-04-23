import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SubscriptionStatusCard } from "@/components/dashboard/subscription-status-card"
import { CharitySummaryCard } from "@/components/dashboard/charity-summary-card"
import { ScoreSummaryCard } from "@/components/dashboard/score-summary-card"
import { DrawStatusCard } from "@/components/dashboard/draw-status-card"
import { WinningsOverviewCard } from "@/components/dashboard/winnings-overview-card"
import { deriveEntryNumbers } from "@/lib/scores/engine"
import { SectionBoundary } from "@/components/dashboard/section-boundary"
import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Dashboard",
  "View your subscription status, scores, charity contributions, and draw participation."
)

/**
 * DashboardPage - Main user overview.
 * Uses parallel data fetching to optimize performance.
 */
export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 1. Fetch all dashboard data in parallel
  const [profileRes, scoresRes, latestDrawRes, winnersRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, charities(*)")
      .eq("id", user.id)
      .single(),
    supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("played_on", { ascending: false })
      .limit(5),
    supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("draw_month", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("winners")
      .select("*, draws(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ])

  const profile = profileRes.data
  const scores = scoresRes.data || []
  const latestDraw = latestDrawRes.data
  const winners = winnersRes.data || []

  // 2. Fetch specific entry for the latest draw if it exists
  let latestEntry = null
  if (latestDraw) {
    const { data: entry } = await supabase
      .from("draw_entries")
      .select("*")
      .eq("draw_id", latestDraw.id)
      .eq("user_id", user.id)
      .maybeSingle()
    latestEntry = entry
  }

  // 3. Derived Logic
  const eligible = scores.length === 5
  const entryNumbers = eligible ? deriveEntryNumbers(scores as any) : []
  const lastMonthWinner = winners.find(
    (w) => w.draw_id === latestDraw?.id && Number(w.prize_amount) > 0
  )

  return (
    <div className="space-y-10 pb-12">
      <PageHeader
        title={`Welcome back, ${profile?.full_name?.split(" ")[0]}`}
        description="Track your progress, manage your impact, and check your draw eligibility."
      />

      {/* Primary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <SectionBoundary label="Subscription">
          <SubscriptionStatusCard
            status={profile?.subscription_status || "inactive"}
            plan={profile?.subscription_plan || null}
          />
        </SectionBoundary>
        <SectionBoundary label="Charity">
          <CharitySummaryCard
            charity={profile?.charities}
            percentage={profile?.charity_percentage || 10}
            isSubscribed={profile?.subscription_status === "active"}
          />
        </SectionBoundary>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10">
        {/* Scores & Performance Section */}
        <SectionBoundary label="Score History">
          <Card className="p-0">
            <div className="rounded-2xl border border-border/10 bg-background/50 p-6 md:p-8">
              <ScoreSummaryCard scores={scores as any} />
            </div>
          </Card>
        </SectionBoundary>

        {/* Draws & Results Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-4">
            <h2 className="px-1 text-xl font-bold tracking-tight">
              Upcoming Draw
            </h2>
            <SectionBoundary label="Draw Status">
              <DrawStatusCard
                eligible={eligible}
                entryNumbers={entryNumbers}
                lastWinner={lastMonthWinner}
              />
            </SectionBoundary>
          </section>

          <section className="space-y-4">
            <h2 className="px-1 text-xl font-bold tracking-tight">
              Winning History
            </h2>
            <SectionBoundary label="Winnings">
              <WinningsOverviewCard winners={winners} />
            </SectionBoundary>
          </section>
        </div>
      </div>
    </div>
  )
}
