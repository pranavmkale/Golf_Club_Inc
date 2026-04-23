import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

/**
 * GET /api/admin/draws/[id]
 * Returns full draw details including entries and winners.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Admin check
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    if (!profile?.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    // 1. Fetch Draw
    const { data: draw, error: drawError } = await supabaseAdmin
      .from("draws")
      .select("*")
      .eq("id", id)
      .single()

    if (drawError) throw drawError

    // 2. Fetch Entries with Profile details
    const { data: entries, error: entriesError } = await supabaseAdmin
      .from("draw_entries")
      .select(
        `
        id,
        entry_numbers,
        matched_count,
        tier,
        profiles (
          id,
          full_name,
          email
        )
      `
      )
      .eq("draw_id", id)
      .order("matched_count", { ascending: false })

    if (entriesError) throw entriesError

    // 3. Fetch Winners with Profile details
    const { data: winners, error: winnersError } = await supabaseAdmin
      .from("winners")
      .select(
        `
        id,
        prize_amount,
        tier,
        profiles (
          id,
          full_name,
          email
        )
      `
      )
      .eq("draw_id", id)

    if (winnersError) throw winnersError

    return NextResponse.json({
      draw,
      entries,
      winners,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
