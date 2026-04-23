/**
 * Calculates the charity contribution amount based on the subscription revenue
 * and the user's chosen charity percentage.
 *
 * @param subscriptionAmount The revenue from the subscription (e.g. 5.00)
 * @param charityPercentage The percentage allocated to charity (e.g. 10 to 100)
 * @returns The contribution amount rounded to 2 decimal places.
 */

export function calculateContribution(
  subscriptionAmount: number,
  charityPercentage: number
): number {
  const amount = (subscriptionAmount * charityPercentage) / 100
  return Math.round(amount * 100) / 100
}
