"use server"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

/**
 * Checks if the current requester is an admin.
 */
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) throw new Error("Forbidden")
  return user
}

/**
 * Updates a user's role or subscription via admin panel.
 */
export async function updateUserAdminAction(userId: string, data: any) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(data)
    .eq("id", userId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/users")
  return { success: true }
}

/**
 * Approves a winner's eligibility.
 */
export async function approveWinnerAction(winnerId: string) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from("winners")
    .update({ verification_status: "approved" })
    .eq("id", winnerId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/winners")
  return { success: true }
}

/**
 * Rejects a winner's claim.
 */
export async function rejectWinnerAction(winnerId: string, reason: string) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from("winners")
    .update({ 
      verification_status: "rejected",
      rejection_reason: reason 
    })
    .eq("id", winnerId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/winners")
  return { success: true }
}

/**
 * Marks a prize as paid.
 */
export async function markAsPaidAction(winnerId: string) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from("winners")
    .update({ payout_status: "paid", paid_at: new Date().toISOString() })
    .eq("id", winnerId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/winners")
  return { success: true }
}

/**
 * Toggles charity visibility and featured status.
 */
export async function toggleCharityAdminAction(charityId: string, data: { is_active?: boolean; is_featured?: boolean }) {
  await verifyAdmin()

  const { error } = await supabaseAdmin
    .from("charities")
    .update(data)
    .eq("id", charityId)

  if (error) throw new Error(error.message)
  revalidatePath("/admin/charities")
  return { success: true }
}
