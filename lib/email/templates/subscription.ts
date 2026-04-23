import { getSiteUrl } from "@/lib/site-url"

/**
 * subscriptionConfirmEmail - Confirmation for successful payment.
 */
export function subscriptionConfirmEmail(
  name: string,
  plan: string,
  amount: number
) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #000; font-weight: 800; text-transform: uppercase;">Payment Confirmed ✅</h1>
      <p>Hi ${name},</p>
      <p>Thank you for subscribing to Golf Draw! Your payment for the <strong>${plan}</strong> plan was successful.</p>
      
      <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px; color: #64748b;">Amount Paid:</p>
        <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 900;">£${(amount / 100).toFixed(2)}</p>
      </div>

      <p>Your subscription is now active. This means:</p>
      <ul style="color: #475569;">
        <li>Your selected charity is receiving monthly support.</li>
        <li>You are eligible to enter every monthly prize draw.</li>
        <li>You can manage your billing anytime via your dashboard.</li>
      </ul>

      <p style="margin-top: 32px;">Good luck on the course!</p>
    </div>
  `
}

/**
 * paymentFailedEmail - Notification for failed payment.
 */
export function paymentFailedEmail(name: string, renewalDate: string) {
  const billingUrl = `${getSiteUrl()}/settings/subscription`

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #dc2626; font-weight: 800; text-transform: uppercase;">Subscription Issue ⚠️</h1>
      <p>Hi ${name},</p>
      <p>We were unable to process your subscription renewal. To ensure your entry into this month's draw and continued support for your charity, please update your payment method.</p>
      
      <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
        <p style="color: #b91c1c; font-weight: bold; margin: 0;">Failed Renewal Date: ${renewalDate}</p>
        <p style="font-size: 14px; color: #991b1b; margin-top: 8px;">Your access to prize draws is currently suspended.</p>
      </div>

      <a href="${billingUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-bottom: 24px;">Update Billing Info</a>
      
      <p style="font-size: 14px; color: #666;">
        If you've recently updated your details, it may take a few hours for our system to re-attempt the charge.
      </p>
    </div>
  `
}
