import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getRolloverAmount, calculatePrizePools } from "@/lib/draw/engine"

export const dynamic = "force-dynamic"

/**
 * GET /api/draws/jackpot
 * Returns the current estimated jackpot amount for the public homepage.
 */
export async function GET() {
  try {
    // 1. Get current active subscriber count
    const { count: activeSubs } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("subscription_status", "active")

    // 2. Get rollover from the most recent published draw
    const rollover = await getRolloverAmount(supabaseAdmin)

    // 3. Calculate current month's addition to the pool (40% of revenue)
    // Assume $5/subscriber
    const estimatedRevenue = (activeSubs || 0) * 5
    const pools = calculatePrizePools(estimatedRevenue)

    // 4. Calculate total jackpot
    const totalJackpot = pools.jackpot + rollover

    // 5. Check if the last draw resulted in a rollover to show badges
    const { data: lastDraw } = await (supabaseAdmin.from("draws") as any)
      .select("jackpot_rolled_over")
      .eq("status", "published")
      .order("draw_month", { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({
      amount: totalJackpot,
      hasRollover: !!lastDraw?.jackpot_rolled_over,
      lastDrawRolledOver: lastDraw?.jackpot_rolled_over || false,
      subscriberCount: activeSubs || 0,
    })
  } catch (error: any) {
    console.error("Public Jackpot API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch jackpot information" },
      { status: 500 }
    )
  }
}
