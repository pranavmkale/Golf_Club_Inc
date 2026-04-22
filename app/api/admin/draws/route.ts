import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import {
  generateRandomDraw,
  generateAlgorithmicDraw,
  matchScores,
  determineTier,
  calculatePrizePools,
  splitPrize,
  getRolloverAmount,
} from "@/lib/draw/engine"
import { deriveEntryNumbers } from "@/lib/scores/engine"
import { Score } from "@/lib/types/database"

interface Subscriber {
  id: string
  email: string
  full_name: string | null
  subscription_plan: string | null
}

interface DrawResult {
  userId: string
  email: string
  fullName: string | null
  plan: string | null
  numbers: number[]
  matches: number
  tier: string
}

interface DrawRecord {
  id: string
  draw_month: string
  draw_type: string
  winning_numbers: number[]
  jackpot_amount: number
  tier_4_amount: number
  tier_3_amount: number
  total_subscribers: number
  status: string
  jackpot_rolled_over: boolean
}

/**
 * POST /api/admin/draws
 * Executes or simulates a draw for a specific month.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Admin check
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const { drawMonth, drawType, simulate = false } = await req.json()

    if (!drawMonth || !drawType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Fetch all active subscribers
    const { data: subscribersData, error: subsError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, subscription_plan")
      .eq("subscription_status", "active")

    if (subsError) throw subsError

    const subscribers = (subscribersData || []) as Subscriber[]

    // 2. Fetch scores and filter eligible users
    const eligibleEntries: Array<{
      userId: string
      email: string
      fullName: string | null
      plan: string | null
      numbers: number[]
    }> = []

    for (const sub of subscribers) {
      const { data: scores } = await supabaseAdmin
        .from("scores")
        .select("*")
        .eq("user_id", sub.id)
        .order("played_on", { ascending: false })
        .limit(5)

      if (scores && scores.length === 5) {
        const entryNumbers = deriveEntryNumbers(scores as Score[])
        eligibleEntries.push({
          userId: sub.id,
          email: sub.email,
          fullName: sub.full_name,
          plan: sub.subscription_plan,
          numbers: entryNumbers,
        })
      }
    }

    // 3. Generate winning numbers
    let winningNumbers: number[]
    if (drawType === "algorithmic") {
      const { data: allScores } = await supabaseAdmin.from("scores").select("*")
      winningNumbers = generateAlgorithmicDraw((allScores || []) as Score[], "most")
    } else {
      winningNumbers = generateRandomDraw()
    }

    // 4. Calculate pools and revenue
    const totalRevenue = subscribers.length * 5
    const pools = calculatePrizePools(totalRevenue)

    // 5. Jackpot Rollover Logic
    const rolloverAmount = await getRolloverAmount(supabaseAdmin)
    const finalJackpot = pools.jackpot + rolloverAmount

    // 6. Match entries and determine winners
    const results = eligibleEntries.map((entry) => {
      const matches = matchScores(entry.numbers, winningNumbers)
      const tier = determineTier(matches)
      return {
        ...entry,
        matches,
        tier,
      }
    })

    // Group winners by tier
    const winnersMap = {
      jackpot: results.filter((r) => r.tier === "jackpot"),
      tier_4: results.filter((r) => r.tier === "tier_4"),
      tier_3: results.filter((r) => r.tier === "tier_3"),
    }

    // Calculate prize amounts
    const prizes = {
      jackpot: splitPrize(finalJackpot, winnersMap.jackpot.length),
      tier_4: splitPrize(pools.tier4, winnersMap.tier_4.length),
      tier_3: splitPrize(pools.tier3, winnersMap.tier_3.length),
    }

    const isRollingOver = winnersMap.jackpot.length === 0

    const summary = {
      drawMonth,
      drawType,
      winningNumbers,
      totalSubscribers: subscribers.length,
      eligibleEntries: eligibleEntries.length,
      pools: { ...pools, jackpot: finalJackpot },
      rollover: { amount: rolloverAmount, active: isRollingOver },
      winners: {
        jackpot: winnersMap.jackpot.length,
        tier4: winnersMap.tier_4.length,
        tier3: winnersMap.tier_3.length,
      },
    }

    if (simulate) {
      return NextResponse.json({ ...summary, detail: results })
    }

    // 7. Save to DB
    const { data: drawData, error: drawError } = await (supabaseAdmin
      .from("draws") as any)
      .insert({
        draw_month: drawMonth,
        draw_type: drawType,
        winning_numbers: winningNumbers,
        jackpot_amount: finalJackpot,
        tier_4_amount: pools.tier4,
        tier_3_amount: pools.tier3,
        total_subscribers: subscribers.length,
        status: "simulated",
        jackpot_rolled_over: isRollingOver,
      })
      .select()
      .single()

    if (drawError) throw drawError

    const draw = drawData as DrawRecord

    // Save entries
    const entriesToInsert = results.map((r) => ({
      draw_id: draw.id,
      user_id: r.userId,
      entry_numbers: r.numbers,
      matched_count: r.matches,
      tier: r.tier,
    }))

    await (supabaseAdmin.from("draw_entries") as any).insert(entriesToInsert)

    // Save winners
    const winnersToInsert: Array<{
      draw_id: string
      user_id: string
      tier: string
      prize_amount: number
    }> = []
    winnersMap.jackpot.forEach((w) => winnersToInsert.push({ draw_id: draw.id, user_id: w.userId, tier: "jackpot", prize_amount: prizes.jackpot }))
    winnersMap.tier_4.forEach((w) => winnersToInsert.push({ draw_id: draw.id, user_id: w.userId, tier: "tier_4", prize_amount: prizes.tier_4 }))
    winnersMap.tier_3.forEach((w) => winnersToInsert.push({ draw_id: draw.id, user_id: w.userId, tier: "tier_3", prize_amount: prizes.tier_3 }))

    if (winnersToInsert.length > 0) {
      await (supabaseAdmin.from("winners") as any).insert(winnersToInsert)
    }

    return NextResponse.json({ success: true, drawId: draw.id, summary })
  } catch (error: any) {
    console.error("Draw Execution Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
