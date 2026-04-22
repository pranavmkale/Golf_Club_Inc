import { Score } from "@/lib/types/database"

/**
 * Validates a golf score and its played date.
 * Rules:
 * - Score must be an integer between 1 and 45.
 * - Date must be valid and not in the future.
 */
export function validateScore(score: number, dateStr: string): { valid: boolean; error?: string } {
  if (!Number.isInteger(score) || score < 1 || score > 45) {
    return { valid: false, error: "Score must be an integer between 1 and 45" }
  }

  const playedOn = new Date(dateStr)
  if (isNaN(playedOn.getTime())) {
    return { valid: false, error: "Invalid date format" }
  }

  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today

  if (playedOn > today) {
    return { valid: false, error: "Score date cannot be in the future" }
  }

  return { valid: true }
}

/**
 * Derives draw entry numbers from the user's current scores.
 * Takes up to 5 scores sorted by date descending and returns their values.
 */
export function deriveEntryNumbers(scores: Score[]): number[] {
  // Sort by date descending (just in case they aren't sorted)
  const sortedScores = [...scores].sort(
    (a, b) => new Date(b.played_on).getTime() - new Date(a.played_on).getTime()
  )

  // Take the top 5 and return their values as numbers (handle potential string values from DB)
  return sortedScores.slice(0, 5).map((s) => Number(s.score))
}

/**
 * Checks if the user has exactly 5 scores and is eligible to enter a draw.
 */
export function canEnterDraw(scores: Score[]): boolean {
  return scores.length === 5
}
