import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client" // Using browser client logic or just supabaseAdmin for public GET
import { supabaseAdmin } from "@/lib/supabase/admin"

/**
 * GET /api/charities
 * Public endpoint to search and list active charities.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"

    let query = supabaseAdmin
      .from("charities")
      .select("*")
      .eq("is_active", true)

    if (featured) {
      query = query.eq("is_featured", true)
    }

    if (search) {
      query = query.ilike("name", `%${search}%`)
    }

    const { data, error } = await query.order("name", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Public Charity API Error:", error)
    return NextResponse.json({ error: "Failed to fetch charities" }, { status: 500 })
  }
}
