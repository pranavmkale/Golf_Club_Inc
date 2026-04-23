import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Stub for sending winner emails.
 */
async function sendWinnerEmail(
  email: string,
  fullName: string,
  tier: string,
  amount: number
) {
  console.log(
    `[EMAIL STUB] Sending to ${email}: Congratulations ${fullName}! You won ${amount} in the ${tier} tier.`
  )
  // Integration with Resend or SendGrid would go here
}

/**
 * POST /api/admin/draws/[id]/publish
 * Publishes a simulated draw and notifies winners.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    // 1. Update draw status
    const { data: draw, error: drawError } = await (
      supabaseAdmin.from("draws") as any
    )
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (drawError) throw drawError

    // 2. Trigger Winner Notifications
    // We call our internal notification API to handle bulk dispatch
    const baseUrl = getSiteUrl()
    try {
      await fetch(`${baseUrl}/api/email/winner-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.get("cookie") || "",
        },
        body: JSON.stringify({ drawId: id }),
      })
    } catch (notificationError) {
      console.error(
        "Failed to trigger automated notifications:",
        notificationError
      )
      // We don't throw here to avoid failing the publish itself, but it should be logged
    }

    return NextResponse.json({ success: true, publishedAt: draw.published_at })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
