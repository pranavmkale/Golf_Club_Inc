import "server-only"
import { Score } from "@/lib/types/database"
import { PrizePools } from "./types"
import crypto from "crypto"

/**
 * Generates an array of 5 unique random integers from 1–45
 * using cryptographically secure randomness.
 */
export function generateRandomDraw(): number[] {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    const randomBytes = crypto.randomBytes(4)
    const randomValue = randomBytes.readUInt32BE()
    const number = (randomValue % 45) + 1
    numbers.add(number)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

/**
 * Generates a draw based on frequency analysis of scores.
 * @param allScores List of all scores to analyze
 * @param mode 'most' frequent or 'least' frequent
 */
export function generateAlgorithmicDraw(
  allScores: Score[],
  mode: "most" | "least" = "most"
): number[] {
  const counts: Record<number, number> = {}

  // Initialize all possible numbers 1-45
  for (let i = 1; i <= 45; i++) {
    counts[i] = 0
  }

  // Count occurrences
  allScores.forEach((s) => {
    if (s.score >= 1 && s.score <= 45) {
      counts[s.score]++
    }
  })

  // Convert to array of entries [number, count]
  const frequencyArray = Object.entries(counts).map(([num, count]) => ({
    num: parseInt(num),
    count,
  }))

  // Sort by frequency
  frequencyArray.sort((a, b) => {
    if (mode === "most") {
      return b.count - a.count // Descending
    } else {
      return a.count - b.count // Ascending
    }
  })

  // To handle ties weighted-randomly or simply:
  // We'll take the top frequencies. If the 5th and 6th have same frequency,
  // we could pick randomly. For now, we take the top 5 unique results.
  const result: number[] = []
  let i = 0
  while (result.length < 5 && i < frequencyArray.length) {
    result.push(frequencyArray[i].num)
    i++
  }

  return result.sort((a, b) => a - b)
}

/**
 * Calculates the count of matching numbers between user entries and winning numbers.
 */
export function matchScores(userNumbers: number[], winningNumbers: number[]): number {
  // Convert to numbers to handle potential string values from JSONB
  const winningSet = new Set(winningNumbers.map((n) => Number(n)))
  let matches = 0
  userNumbers.forEach((num) => {
    if (winningSet.has(Number(num))) {
      matches++
    }
  })
  return matches
}

/**
 * Determines the prize tier based on the number of matches.
 */
export function determineTier(
  matchCount: number
): "jackpot" | "tier_4" | "tier_3" | "none" {
  if (matchCount === 5) return "jackpot"
  if (matchCount === 4) return "tier_4"
  if (matchCount === 3) return "tier_3"
  return "none"
}

/**
 * Calculates the allocated prize pools based on total subscription revenue.
 */
export function calculatePrizePools(totalSubscriptionRevenue: number): PrizePools {
  return {
    jackpot: totalSubscriptionRevenue * 0.4,
    tier4: totalSubscriptionRevenue * 0.35,
    tier3: totalSubscriptionRevenue * 0.25,
  }
}

/**
 * Splits a prize pool among winners.
 */
export function splitPrize(poolAmount: number, winnerCount: number): number {
  if (winnerCount <= 0) return 0
  return Math.round((poolAmount / winnerCount) * 100) / 100
}

/**
 * Finds the most recent published draw where the jackpot was rolled over.
 */
export async function getRolloverAmount(supabase: any): Promise<number> {
  const { data, error } = await supabase
    .from("draws")
    .select("jackpot_amount")
    .eq("status", "published")
    .eq("jackpot_rolled_over", true)
    .order("draw_month", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return 0
  return Number(data.jackpot_amount)
}
