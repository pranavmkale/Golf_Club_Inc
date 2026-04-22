import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { format } from "date-fns"

/**
 * GET /api/admin/export/charities
 * Exports all charities as CSV for admin download.
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

    // Fetch all charities with contribution totals
    const { data: charities, error: charitiesError } = await supabaseAdmin
      .from("charities")
      .select(`
        *,
        charity_contributions(amount)
      `)
      .order("name", { ascending: true })

    if (charitiesError) throw charitiesError

    // Calculate totals per charity
    const charitiesWithTotals = (charities || []).map((charity: any) => {
      const total = (charity.charity_contributions || []).reduce(
        (sum: number, c: any) => sum + Number(c.amount || 0),
        0
      )
      return { ...charity, total_contributions: total }
    })

    // CSV Header
    const headers = [
      "ID",
      "Name",
      "Description",
      "Website URL",
      "Is Active",
      "Is Featured",
      "Total Contributions",
      "Logo URL",
      "Cover Image URL",
      "Created At",
    ]

    // CSV Rows
    const rows = charitiesWithTotals.map((charity: any) => [
      charity.id,
      charity.name,
      (charity.description || "").substring(0, 100),
      charity.website_url || "",
      charity.is_active ? "Yes" : "No",
      charity.is_featured ? "Yes" : "No",
      charity.total_contributions,
      charity.logo_url || "",
      charity.cover_image_url || "",
      format(new Date(charity.created_at), "yyyy-MM-dd HH:mm:ss"),
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
        "Content-Disposition": `attachment; filename="charities-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.csv"`,
      },
    })
  } catch (error: any) {
    console.error("Export charities error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
