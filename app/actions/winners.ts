"use server"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"]

/**
 * submitProofAction - Handles user submission of score proof for a winning draw.
 */
export async function submitProofAction(winnerId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  // 1. Validation
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPG, PNG, or PDF.")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.")
  }

  // 2. Upload to Supabase Storage
  // Path format: {userId}/{winnerId}.{extension}
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

  // 3. Get Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("winner-proofs").getPublicUrl(filePath)

  // 4. Update the winner record
  const { error: updateError } = await (supabaseAdmin.from("winners") as any)
    .update({
      proof_url: publicUrl,
      verification_status: "pending", // Reset status to pending on re-upload
    })
    .eq("id", winnerId)
    .eq("user_id", user.id) // Security check

  if (updateError) {
    console.error("Database update error:", updateError)
    throw new Error("Failed to save proof location.")
  }

  revalidatePath("/dashboard/winnings")
  return { success: true, url: publicUrl }
}
