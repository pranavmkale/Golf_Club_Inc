"use server"

import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/client"
import {
  createStripeCustomer,
  createCheckoutSession,
  createPortalSession,
} from "@/lib/stripe/helpers"
import { redirect } from "next/navigation"

/**
 * Initiate a Stripe Checkout session.
 */
export async function createCheckoutAction(priceId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile to check for existing customer ID
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) {
    throw new Error("User profile not found")
  }

  let customerId = profile.stripe_customer_id

  // If no Stripe customer exists, create one and update the profile
  if (!customerId) {
    customerId = await createStripeCustomer(
      profile.email || user.email!,
      profile.full_name || "New Member"
    )
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id)
  }

  const checkoutUrl = await createCheckoutSession(customerId, priceId, user.id)

  redirect(checkoutUrl)
}

/**
 * Initiate a Stripe Customer Portal session.
 */
export async function createPortalAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    throw new Error("No Stripe customer found for this user")
  }

  const portalUrl = await createPortalSession(profile.stripe_customer_id)

  redirect(portalUrl)
}

/**
 * Cancel the user's subscription.
 */
export async function cancelSubscriptionAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id, subscription_status")
    .eq("id", user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return { error: "No subscription found" }
  }

  if (profile.subscription_status !== "active") {
    return { error: "No active subscription to cancel" }
  }

  try {
    // Find the user's active subscription in Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return { error: "No active subscription found in Stripe" }
    }

    const subscription = subscriptions.data[0]

    // Cancel at period end (user keeps access until then)
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    })

    return { success: true }
  } catch (error: any) {
    console.error("Cancel subscription error:", error)
    return { error: error.message || "Failed to cancel subscription" }
  }
}
