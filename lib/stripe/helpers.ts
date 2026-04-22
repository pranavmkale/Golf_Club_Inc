import "server-only"
import { stripe } from "./client"
import { getSiteUrl } from "@/lib/site-url"

/**
 * Creates a Stripe customer and returns the customer ID.
 */
export async function createStripeCustomer(email: string, name: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })
  return customer.id
}

/**
 * Creates a Stripe Checkout session for a subscription.
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const siteUrl = getSiteUrl()

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard?subscribed=true`,
    cancel_url: `${siteUrl}/pricing`,
    metadata: {
      userId,
    },
  })

  if (!session.url) {
    throw new Error("Failed to create checkout session URL")
  }

  return session.url
}

/**
 * Creates a Stripe Billing Portal session for customer subscription management.
 */
export async function createPortalSession(customerId: string) {
  const siteUrl = getSiteUrl()

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/dashboard`,
  })

  return session.url
}

/**
 * Returns the Stripe price IDs from environment variables.
 */
export function getPriceIds() {
  return {
    monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_YEARLY_PRICE_ID,
  }
}
