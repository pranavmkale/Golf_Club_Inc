"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface UpdateProfileData {
  full_name: string
}

export async function updateProfileAction(data: UpdateProfileData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
      })
      .eq("id", user.id)

    if (error) {
      console.error("[Profile Update Error]", error)
      return { error: error.message }
    }

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true }
  } catch (err: any) {
    console.error("[Profile Update Error]", err)
    return { error: err.message || "Failed to update profile" }
  }
}
