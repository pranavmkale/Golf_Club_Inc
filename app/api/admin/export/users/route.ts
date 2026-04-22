import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { format } from "date-fns"

/**
 * GET /api/admin/export/users
 * Exports all users as CSV for admin download.
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

    // Fetch all users with related data
    const { data: users, error: usersError } = await supabaseAdmin
      .from("profiles")
      .select("*, charities(name)")
      .order("created_at", { ascending: false })

    if (usersError) throw usersError

    // Fetch score counts
    const { data: scoresData } = await supabaseAdmin
      .from("scores")
      .select("user_id")

    const scores = (scoresData || []) as Array<{ user_id: string }>
    const scoreCounts: Record<string, number> = {}
    scores.forEach((s) => {
      scoreCounts[s.user_id] = (scoreCounts[s.user_id] || 0) + 1
    })

    // CSV Header
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Subscription Status",
      "Subscription Plan",
      "Charity",
      "Charity %",
      "Scores Entered",
      "Is Admin",
      "Created At",
      "Stripe Customer ID",
    ]

    // CSV Rows
    const rows = (users || []).map((user: any) => [
      user.id,
      user.full_name || "",
      user.email || "",
      user.subscription_status || "inactive",
      user.subscription_plan || "",
      user.charities?.name || "",
      user.charity_percentage || "10",
      scoreCounts[user.id] || 0,
      user.is_admin ? "Yes" : "No",
      format(new Date(user.created_at), "yyyy-MM-dd HH:mm:ss"),
      user.stripe_customer_id || "",
    ])

    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    // Return as downloadable file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export users error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
