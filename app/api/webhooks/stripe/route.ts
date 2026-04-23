import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe/client"
import { constructWebhookEvent } from "@/lib/stripe/webhook"
import { supabaseAdmin } from "@/lib/supabase/admin"
import Stripe from "stripe"
import { sendEmail } from "@/lib/email/client"
import {
  subscriptionConfirmEmail,
  paymentFailedEmail,
} from "@/lib/email/templates/subscription"

export async function POST(req: Request) {
  const body = await req.arrayBuffer()
  const signatures = (await headers()).get("stripe-signature")

  if (!signatures) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(Buffer.from(body), signatures)
  } catch (err: any) {
    console.error(`❌ Webhook Signature Error: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  console.log(`📩 Received Stripe event: ${event.type}`)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const userId = session.metadata?.userId

        if (!userId) {
          console.warn("⚠️ No userId found in session metadata")
          break
        }

        const subscriptionId = session.subscription as string | null
        if (!subscriptionId) {
          console.warn("⚠️ No subscription ID found in checkout session")
          break
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const typedSubscription = subscription as any
        const price = typedSubscription.items.data[0].plan
        const plan = price.interval === "month" ? "monthly" : "yearly"

        console.log(`🔄 Processing checkout for user: ${userId}, plan: ${plan}`)

        // Update profile with subscription info
        const { data: profile, error: profileError } = await (
          supabaseAdmin as any
        )
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId,
            subscription_status: "active",
            subscription_plan: plan,
          })
          .eq("id", userId)
          .select()
          .single()

        if (profileError) {
          console.error(
            `❌ Failed to update profile for ${userId}:`,
            profileError
          )
          throw profileError
        }

        console.log(
          `✅ Profile updated for ${userId}. Recording contribution...`
        )

        const typedProfile = profile as any

        // Record initial charity contribution
        if (typedProfile && typedProfile.charity_id) {
          const amount =
            (session.amount_total! * typedProfile.charity_percentage) / 100
          const { error: contributionError } = await supabaseAdmin
            .from("charity_contributions")
            .insert({
              user_id: userId,
              charity_id: typedProfile.charity_id,
              amount: amount,
              period_start: new Date(
                typedSubscription.current_period_start * 1000
              ).toISOString(),
              period_end: new Date(
                typedSubscription.current_period_end * 1000
              ).toISOString(),
            } as any)

          if (contributionError) {
            console.error(
              "❌ Failed to record charity contribution:",
              contributionError
            )
          } else {
            console.log(
              `💰 Contribution recorded for charity ${typedProfile.charity_id}`
            )
          }
        }

        // 3. Send Confirmation Email
        if (typedProfile && typedProfile.email) {
          console.log(`📧 Sending confirmation email to ${typedProfile.email}`)
          sendEmail(
            typedProfile.email,
            "Payment Confirmed ✅",
            subscriptionConfirmEmail(
              typedProfile.full_name || "Member",
              plan,
              session.amount_total || 0
            )
          )
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          canceled: "cancelled",
          unpaid: "inactive",
        }

        const plan =
          subscription.items.data[0].plan.interval === "month"
            ? "monthly"
            : "yearly"

        console.log(
          `🔄 Subscription updated: ${subscription.id}, status: ${subscription.status}`
        )

        const { error } = await (supabaseAdmin as any)
          .from("profiles")
          .update({
            subscription_status:
              (statusMap[subscription.status] as any) || "inactive",
            subscription_plan: plan,
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error)
          console.error(
            `❌ Failed to update subscription ${subscription.id}:`,
            error
          )
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        console.log(`🗑️ Subscription deleted: ${subscription.id}`)

        const { error } = await (supabaseAdmin as any)
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            subscription_plan: null,
          })
          .eq("stripe_subscription_id", subscription.id)

        if (error)
          console.error(
            `❌ Failed to delete subscription ${subscription.id}:`,
            error
          )
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string | null
        if (subscriptionId) {
          console.log(
            `⚠️ Payment failed for invoice: ${invoice.id}, sub: ${subscriptionId}`
          )

          const { data: profile, error } = await (supabaseAdmin as any)
            .from("profiles")
            .update({
              subscription_status: "past_due",
            })
            .eq("stripe_subscription_id", subscriptionId)
            .select("email, full_name")
            .single()

          const typedProfile = profile as any

          if (error) {
            console.error(
              `❌ Failed to handle failed payment for ${subscriptionId}:`,
              error
            )
          } else if (typedProfile?.email) {
            console.log(
              `📧 Sending payment failed email to ${typedProfile.email}`
            )
            sendEmail(
              typedProfile.email,
              "Subscription Issue ⚠️",
              paymentFailedEmail(
                typedProfile.full_name || "Member",
                new Date().toDateString()
              )
            )
          }
        }
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string | null
        if (subscriptionId && invoice.amount_paid > 0) {
          console.log(
            `✅ Invoice paid: ${invoice.id}, amount: ${invoice.amount_paid}`
          )

          // Record subsequent charity contributions
          const { data: profile, error } = await (supabaseAdmin as any)
            .from("profiles")
            .select("id, charity_id, charity_percentage")
            .eq("stripe_customer_id", invoice.customer as string)
            .single()

          const typedProfile = profile as any

          if (error) {
            console.error(
              `❌ Failed to find profile for paid invoice ${invoice.id}:`,
              error
            )
          } else if (typedProfile?.charity_id) {
            const amount =
              (invoice.amount_paid * typedProfile.charity_percentage) / 100
            const { error: contributionError } = await supabaseAdmin
              .from("charity_contributions")
              .insert({
                user_id: typedProfile.id,
                charity_id: typedProfile.charity_id,
                amount: amount,
                period_start: new Date(
                  invoice.period_start * 1000
                ).toISOString(),
                period_end: new Date(invoice.period_end * 1000).toISOString(),
              } as any)

            if (contributionError) {
              console.error(
                "❌ Failed to record subsequent charity contribution:",
                contributionError
              )
            } else {
              console.log(`💰 Subsequent contribution recorded`)
            }
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err: any) {
    console.error(`❌ Webhook Handler Error: ${err.message}`)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}
