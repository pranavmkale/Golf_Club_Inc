"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { addMonths, startOfMonth } from "date-fns"

export async function createDrawAction() {
  const supabase = supabaseAdmin

  const now = new Date()
  const nextMonth = startOfMonth(addMonths(now, 1))

  const { data, error } = await (supabase.from("draws") as any)
    .insert({
      draw_month: nextMonth.toISOString(),
      status: "draft",
      draw_type: "random",
    })
    .select()
    .single()

  if (error) {
    console.error("❌ Failed to create draw:", error)
    throw new Error("Could not create draw")
  }

  return data
}
