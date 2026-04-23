"use server"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]

/**
 * Handles user submission of score proof for a winning draw.
 */
export async function submitProofAction(winnerId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPG, PNG, or PDF.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.")
  }

  const fileExtension = file.name.split(".").pop()
  const filePath = `${user.id}/${winnerId}.${fileExtension}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("winner-proofs")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    console.error("Storage upload error:", uploadError)
    throw new Error("Failed to upload proof. Please try again.")
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("winner-proofs").getPublicUrl(filePath)

  const { error: updateError } = await (supabaseAdmin.from("winners") as any)
    .update({
      proof_url: publicUrl,
      verification_status: "pending",
    })
    .eq("id", winnerId)
    .eq("user_id", user.id)

  if (updateError) {
    console.error("Database update error:", updateError)
    throw new Error("Failed to save proof location.")
  }

  revalidatePath("/dashboard/winnings")
  return { success: true, url: publicUrl }
}
