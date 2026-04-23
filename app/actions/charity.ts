"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * Server action to select a charity for the user's profile.
 */
export async function selectCharityAction(charityId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ charity_id: charityId })
    .eq("id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/settings")
  revalidatePath("/charity")
  return { success: true }
}

/**
 * Server action to update the user's charity contribution percentage.
 */
export async function updateCharityPercentageAction(percentage: number) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Validation: integer, min 10, max 100
  if (!Number.isInteger(percentage) || percentage < 10 || percentage > 100) {
    return {
      success: false,
      error: "Percentage must be an integer between 10 and 100",
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ charity_percentage: percentage })
    .eq("id", user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/settings/subscription")
  revalidatePath("/charity")
  return { success: true }
}
