import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { format } from "date-fns"

/**
 * GET /api/admin/export/winners
 * Exports all winners as CSV for admin download.
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

    // Fetch all winners with user and draw info
    const { data: winners, error: winnersError } = await supabaseAdmin
      .from("winners")
      .select(`
        *,
        draw:draws(draw_month),
        profile:profiles(full_name, email)
      `)
      .order("created_at", { ascending: false })

    if (winnersError) throw winnersError

    // CSV Header
    const headers = [
      "ID",
      "Draw Month",
      "User Name",
      "User Email",
      "Tier",
      "Prize Amount",
      "Verification Status",
      "Payout Status",
      "Paid At",
      "Created At",
    ]

    // CSV Rows
    const rows = (winners || []).map((winner: any) => [
      winner.id,
      winner.draw?.draw_month ? format(new Date(winner.draw.draw_month), "yyyy-MM-dd") : "",
      winner.profile?.full_name || "",
      winner.profile?.email || "",
      winner.tier,
      winner.prize_amount || 0,
      winner.verification_status || "pending",
      winner.payout_status || "pending",
      winner.paid_at ? format(new Date(winner.paid_at), "yyyy-MM-dd HH:mm:ss") : "",
      format(new Date(winner.created_at), "yyyy-MM-dd HH:mm:ss"),
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
        "Content-Disposition": `attachment; filename="winners-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export winners error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
