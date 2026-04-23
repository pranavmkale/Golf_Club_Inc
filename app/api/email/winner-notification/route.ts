import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/client"
import { drawResultEmail } from "@/lib/email/templates/draw-result"
import { format } from "date-fns"

interface Winner {
  id: string
  draw_id: string
  user_id: string
  tier: string
  prize_amount: number
  created_at: string
}

interface Draw {
  id: string
  draw_month: string
  winning_numbers: number[]
  status: string
}

/**
 * POST /api/email/winner-notification
 * Admin-only: Dispatches draw results to all participants of a specific draw.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // 1. Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    if (!profile?.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { drawId } = await req.json()
    if (!drawId)
      return NextResponse.json({ error: "Missing drawId" }, { status: 400 })

    // 2. Fetch Draw details
    const { data: drawData, error: drawError } = await supabaseAdmin
      .from("draws")
      .select("*")
      .eq("id", drawId)
      .single()

    if (drawError) throw drawError
    const draw = drawData as Draw

    // 3. Fetch all participants for this draw
    const { data: participants, error: participantsError } = await supabaseAdmin
      .from("draw_entries")
      .select(
        `
        user_id,
        entry_numbers,
        profiles (
          email,
          full_name
        )
      `
      )
      .eq("draw_id", drawId)

    if (participantsError) throw participantsError

    // 4. Fetch winners for this draw to differentiate emails
    const { data: winnersData, error: winnersError } = await supabaseAdmin
      .from("winners")
      .select("*")
      .eq("draw_id", drawId)

    if (winnersError) throw winnersError

    const winners = (winnersData || []) as Winner[]
    const winnerMap = new Map(winners.map((w: Winner) => [w.user_id, w]))
    const drawDateString = format(new Date(draw.draw_month), "MMMM yyyy")

    // 5. Sequential Email Dispatch (Note: Batching/Queueing recommended for production scale)
    const results = []
    for (const participant of participants as any) {
      const winner = winnerMap.get(participant.user_id)
      const recipientEmail = participant.profiles?.email
      const recipientName = participant.profiles?.full_name || "Member"

      if (!recipientEmail) continue

      const template = drawResultEmail(recipientName, {
        isWinner: !!winner,
        tier: winner?.tier,
        amount: winner ? Number(winner.prize_amount) : undefined,
        winningNumbers: draw.winning_numbers,
        userNumbers: participant.entry_numbers,
        drawDate: drawDateString,
      })

      const subject = winner
        ? "You won! Your draw result is in 🏆"
        : `Draw results for ${drawDateString} are in`

      const res = await sendEmail(recipientEmail, subject, template)
      results.push({ email: recipientEmail, success: res.success })
    }

    return NextResponse.json({
      success: true,
      totalNotified: results.length,
      errors: results.filter((r) => !r.success).length,
    })
  } catch (error: any) {
    console.error("Winner Notification API Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
