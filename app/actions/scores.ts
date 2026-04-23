"use server"

import { createClient } from "@/lib/supabase/server"
import { validateScore } from "@/lib/scores/engine"
import { revalidatePath } from "next/cache"

/**
 * Add a new golf score.
 */
export async function addScoreAction(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const score = parseInt(formData.get("score") as string)
  const date = formData.get("date") as string

  // 1. Validate score and date
  const validation = validateScore(score, date)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // 2. Check for duplicate score on same date
  const { data: existingScore } = await supabase
    .from("scores")
    .select("id")
    .eq("user_id", user.id)
    .eq("played_on", date)
    .single()

  if (existingScore) {
    return { success: false, error: "A score already exists for this date" }
  }

  // 3. Manage 5-score limit
  const { data: scores, error: countError } = await supabase
    .from("scores")
    .select("id, played_on, created_at")
    .eq("user_id", user.id)
    .order("played_on", { ascending: true })
    .order("created_at", { ascending: true })

  if (countError) {
    return { success: false, error: "Failed to verify existing scores" }
  }

  if (scores.length >= 5) {
    // Delete the oldest score
    const oldestId = scores[0].id
    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .eq("id", oldestId)

    if (deleteError) {
      return { success: false, error: "Failed to manage score limit" }
    }
  }

  // 4. Insert new score
  const { error: insertError } = await supabase.from("scores").insert({
    user_id: user.id,
    score: score,
    played_on: date,
  })

  if (insertError) {
    return { success: false, error: insertError.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

/**
 * Update an existing score.
 */
export async function updateScoreAction(
  scoreId: string,
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "Unauthorized" }

  const score = parseInt(formData.get("score") as string)
  const date = formData.get("date") as string

  const validation = validateScore(score, date)
  if (!validation.valid) return { success: false, error: validation.error }

  const { error } = await supabase
    .from("scores")
    .update({ score, played_on: date })
    .eq("id", scoreId)
    .eq("user_id", user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/scores")
  return { success: true }
}

/**
 * Delete a score.
 */
export async function deleteScoreAction(scoreId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: "Unauthorized" }

  const { error } = await supabase
    .from("scores")
    .delete()
    .eq("id", scoreId)
    .eq("user_id", user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath("/dashboard")
  revalidatePath("/scores")
  return { success: true }
}
