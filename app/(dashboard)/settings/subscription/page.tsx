import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/client"
import { getPriceIds } from "@/lib/stripe/helpers"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { SubscriptionClient } from "./client-page"
import { PageHeader } from "@/components/layout/page-header"

export const metadata: Metadata = {
  title: "Subscription - Golf Club",
  description: "Manage your subscription and billing details.",
}

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    throw new Error("Profile not found")
  }

  const priceIds = getPriceIds()

  if (!priceIds.monthly || !priceIds.yearly) {
    throw new Error(
      "Stripe price IDs are not configured in environment variables"
    )
  }

  // Fetch real-time price info from Stripe
  const [monthlyPrice, yearlyPrice] = await Promise.all([
    stripe.prices.retrieve(priceIds.monthly),
    stripe.prices.retrieve(priceIds.yearly),
  ])

  // Calculate savings
  const monthlyAnnual = (monthlyPrice.unit_amount || 0) * 12
  const yearlyAnnual = yearlyPrice.unit_amount || 0
  const savingsPercent = Math.round(
    ((monthlyAnnual - yearlyAnnual) / monthlyAnnual) * 100
  )

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: monthlyPrice.currency,
  })

  // Fetch subscription details from Stripe if user has active subscription
  let subscriptionDetails = null
  if (profile.subscription_status === "active" && profile.stripe_customer_id) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
        limit: 1,
      })

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0] as any
        subscriptionDetails = {
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          status: subscription.status,
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription details:", error)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Subscription"
        description="Manage your subscription and billing details."
      >
        <Badge
          variant={
            profile.subscription_status === "active" ? "default" : "secondary"
          }
          className="px-3 py-1 text-sm font-medium capitalize"
        >
          {profile.subscription_status || "Inactive"}
        </Badge>
      </PageHeader>

      <SubscriptionClient
        profile={profile}
        monthlyPrice={{
          id: monthlyPrice.id,
          amount: formatter.format((monthlyPrice.unit_amount || 0) / 100),
        }}
        yearlyPrice={{
          id: yearlyPrice.id,
          amount: formatter.format((yearlyPrice.unit_amount || 0) / 100),
          savings: savingsPercent > 0 ? `Save ${savingsPercent}%` : undefined,
        }}
        subscriptionDetails={subscriptionDetails}
      />
    </div>
  )
}
