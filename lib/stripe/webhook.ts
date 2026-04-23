import "server-only"
import Stripe from "stripe"
import { stripe } from "./client"

/**
 * Verifies and constructs a Stripe webhook event.
 */
export function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined")
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
