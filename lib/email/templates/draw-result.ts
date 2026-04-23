import { getSiteUrl } from "@/lib/site-url"

/**
 * drawResultEmail - Notifies users of the monthly draw outcomes.
 */
export function drawResultEmail(
  name: string,
  result: {
    isWinner: boolean
    tier?: string
    amount?: number
    winningNumbers: number[]
    userNumbers: number[]
    drawDate: string
  }
) {
  const resultsUrl = `${getSiteUrl()}/dashboard`

  const winnerBadge = `
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
      <h2 style="color: #166534; margin: 0;">CONGRATULATIONS! 🏆</h2>
      <p style="font-size: 24px; font-weight: 900; margin: 12px 0;">£${result.amount?.toFixed(2)}</p>
      <p style="font-size: 14px; color: #166534;">You won in the <strong>${result.tier?.replace("_", " ").toUpperCase()}</strong> tier!</p>
    </div>
  `

  const noWinBadge = `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
      <h2 style="color: #475569; margin: 0;">Results are in</h2>
      <p style="font-size: 14px; color: #64748b; margin-top: 8px;">Better luck next time! Your contribution this month supported a great cause.</p>
    </div>
  `

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="color: #000; font-weight: 800; text-transform: uppercase;">Draw Results: ${result.drawDate}</h1>
      <p>Hi ${name},</p>
      <p>The results for the latest draw are now official. Here is how your numbers matched up:</p>
      
      ${result.isWinner ? winnerBadge : noWinBadge}

      <div style="margin: 32px 0;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px;">Winning Numbers</p>
        <div style="display: flex; gap: 8px;">
          ${result.winningNumbers.map((n) => `<span style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #000; color: #fff; font-weight: bold; margin-right: 4px;">${n}</span>`).join("")}
        </div>
      </div>

      <div style="margin: 32px 0;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 8px;">Your Registered Numbers</p>
        <div style="display: flex; gap: 8px;">
          ${result.userNumbers.map((n) => `<span style="display: inline-block; width: 32px; height: 32px; line-height: 32px; text-align: center; border-radius: 50%; background-color: #f1f5f9; color: #1a1a1a; font-weight: bold; border: 1px solid #e2e8f0; margin-right: 4px;">${n}</span>`).join("")}
        </div>
      </div>

      <p>Thank you for playing and supporting our charities this month. Your next opportunity to win begins on the 1st of the month!</p>

      <a href="${resultsUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 24px;">View Official Results</a>
      
      <p style="margin-top: 48px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 24px;">
        Winners must ensure their profile info is complete to verify eligibility. See platform terms for payout details.
      </p>
    </div>
  `
}
