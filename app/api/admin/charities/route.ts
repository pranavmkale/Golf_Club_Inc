import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

/**
 * GET /api/admin/charities
 * Lists all charities (including inactive) for admin management.
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()
  if (!profile?.is_admin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from("charities")
    .select("*")
    .order("name")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

/**
 * POST /api/admin/charities
 * Creates a new charity.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()
    if (!profile?.is_admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await req.json()
    const {
      name,
      description,
      logo_url,
      cover_image_url,
      website_url,
      is_featured,
    } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    console.log("[Admin Charities] Creating charity:", {
      name,
      description,
      website_url,
      is_featured,
    })

    // Build insert data (exclude website_url until column is added)
    const insertData: any = {
      name,
      description,
      logo_url,
      cover_image_url,
      is_featured: is_featured || false,
      is_active: true,
    }
    // Only add website_url if it exists in DB (user needs to run migration)
    if (website_url) insertData.website_url = website_url

    const { data, error } = await (supabaseAdmin.from("charities") as any)
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("[Admin Charities] Supabase error:", error)
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    console.log("[Admin Charities] Created charity:", data)
    return NextResponse.json(data)
  } catch (err: any) {
    console.error("[Admin Charities] Unexpected error:", err)
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}
