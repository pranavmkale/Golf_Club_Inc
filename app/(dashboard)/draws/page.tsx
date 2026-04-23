import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { format, differenceInDays } from "date-fns"
import type { Draw, DrawEntry, Score, Profile } from "@/lib/types/database"
import { DrawPageHeader } from "@/components/draws/draw-page-header"
import { CurrentDrawCard } from "@/components/draws/current-draw-card"
import { PastDrawsList } from "@/components/draws/past-draws-list"
import { HowDrawWorksInfo } from "@/components/draws/how-draw-works-info"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata(
  "Monthly Draws",
  "View current and past draws, check winning numbers, and track your entries."
)

export default async function DrawsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. Fetch scores first (needed for latest draw ID)
  const [
    { data: scoresData },
    { data: profileData },
    { data: latestDrawData },
  ] = await Promise.all([
    supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("played_on", { ascending: false })
      .limit(5),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("draws")
      .select("*")
      .eq("status", "published")
      .order("draw_month", { ascending: false })
      .limit(1)
      .single(),
  ])

  const scores: Score[] = scoresData ?? []
  const profile = profileData as Profile | null
  const latestDraw = latestDrawData as Draw | null

  // 2. Fetch user's entry for latest draw + past draws with entries — in parallel
  const [{ data: userEntryData }, { data: pastDrawsData }] = await Promise.all([
    latestDraw
      ? supabase
          .from("draw_entries")
          .select("*")
          .eq("draw_id", latestDraw.id)
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
    supabase
      .from("draws")
      .select("*, draw_entries(*)")
      .eq("status", "published")
      .order("draw_month", { ascending: false }),
  ])

  // Derive entry numbers if user has 5 scores
  const userEntryNumbers =
    scores.length === 5 ? scores.map((s) => s.score) : null

  // Compute next draw date (last day of current month)
  const now = new Date()
  const nextDrawDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const nextDrawDateStr = format(nextDrawDate, "d MMMM yyyy")
  const daysUntilDraw = Math.max(0, differenceInDays(nextDrawDate, now))

  // Build past draws with the user's entry attached
  const pastDraws = ((pastDrawsData as any[]) ?? []).map((draw) => {
    const entries = (draw.draw_entries ?? []) as DrawEntry[]
    const userEntry = entries.find((e) => e.user_id === user.id) ?? null
    const { draw_entries: _, ...drawWithout } = draw
    return { ...drawWithout, userEntry } as Draw & {
      userEntry: DrawEntry | null
    }
  })

  const isSubscribed = profile?.subscription_status === "active"

  return (
    <div className="space-y-8">
      <DrawPageHeader
        nextDrawDate={nextDrawDateStr}
        daysUntilDraw={daysUntilDraw}
      />

      <CurrentDrawCard
        nextDrawDate={nextDrawDateStr}
        userEntryNumbers={userEntryNumbers}
        isSubscribed={isSubscribed}
        latestDraw={latestDraw}
      />

      <PastDrawsList pastDraws={pastDraws} />

      <HowDrawWorksInfo />
    </div>
  )
}
