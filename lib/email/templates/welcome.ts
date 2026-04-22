import { getSiteUrl } from "@/lib/site-url"

/**
 * welcomeEmail - Welcome template for new users.
 */
export function welcomeEmail(name: string) {
  const dashboardUrl = `${getSiteUrl()}/dashboard`
  
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #000; font-weight: 800; text-transform: uppercase; letter-spacing: -0.05em;">Welcome to Golf Draw 🎉</h1>
      <p>Hi ${name},</p>
      <p>We're thrilled to have you join our community of supporters. You've taken the first step toward combining your passion for golf with real charitable impact.</p>
      
      <div style="background-color: #f4f4f4; padding: 24px; border-radius: 12px; margin: 32px 0;">
        <h3 style="margin-top: 0;">Next Steps:</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Activate your subscription:</strong> Support world-class causes and enter our monthly prize draws.</li>
          <li><strong>Add your scores:</strong> Every score you play brings you closer to the jackpot.</li>
          <li><strong>Track your impact:</strong> See exactly how your contribution is changing lives.</li>
        </ul>
      </div>

      <a href="${dashboardUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
      
      <p style="margin-top: 48px; font-size: 12px; color: #666;">
        If you have any questions, just reply to this email. We're here to help!
      </p>
    </div>
  `
}
