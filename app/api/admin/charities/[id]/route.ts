import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

/**
 * PATCH /api/admin/charities/[id]
 * Updates a charity profile.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
    is_active,
  } = body

  // Build update object with only provided fields
  const updateData: Record<string, any> = {}
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (logo_url !== undefined) updateData.logo_url = logo_url
  if (cover_image_url !== undefined)
    updateData.cover_image_url = cover_image_url
  // Only update website_url if column exists (user needs to run migration)
  if (website_url !== undefined && website_url !== "")
    updateData.website_url = website_url
  if (is_featured !== undefined) updateData.is_featured = is_featured
  if (is_active !== undefined) updateData.is_active = is_active

  const { data, error } = await (supabaseAdmin.from("charities") as any)
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

/**
 * DELETE /api/admin/charities/[id]
 * Soft-deletes a charity by setting is_active to false.
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const { data, error } = await (supabaseAdmin.from("charities") as any)
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, message: "Charity soft-deleted" })
}
