import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { format } from "date-fns"

/**
 * GET /api/admin/export/draws
 * Exports all draws as CSV for admin download.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all draws
    const { data: draws, error: drawsError } = await supabaseAdmin
      .from("draws")
      .select("*")
      .order("draw_month", { ascending: false })

    if (drawsError) throw drawsError

    // CSV Header
    const headers = [
      "ID",
      "Draw Month",
      "Draw Type",
      "Status",
      "Winning Numbers",
      "Jackpot Amount",
      "Tier 4 Amount",
      "Tier 3 Amount",
      "Total Pool",
      "Total Subscribers",
      "Jackpot Rollover",
      "Published At",
      "Created At",
    ]

    // CSV Rows
    const rows = (draws || []).map((draw: any) => [
      draw.id,
      format(new Date(draw.draw_month), "yyyy-MM-dd"),
      draw.draw_type,
      draw.status,
      (draw.winning_numbers || []).join("-"),
      draw.jackpot_amount || 0,
      draw.tier_4_amount || 0,
      draw.tier_3_amount || 0,
      (Number(draw.jackpot_amount) + Number(draw.tier_4_amount) + Number(draw.tier_3_amount)),
      draw.total_subscribers || 0,
      draw.jackpot_rolled_over ? "Yes" : "No",
      draw.published_at ? format(new Date(draw.published_at), "yyyy-MM-dd HH:mm:ss") : "",
      format(new Date(draw.created_at), "yyyy-MM-dd HH:mm:ss"),
    ])

    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="draws-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export draws error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
