export interface PrizePools {
  jackpot: number
  tier4: number
  tier3: number
}

export interface DrawEntryResult {
  userId: string
  userNumbers: number[]
  matchCount: number
  tier: "jackpot" | "tier_4" | "tier_3" | "none"
  prizeAmount: number
}

export interface DrawResult {
  drawId: string
  winningNumbers: number[]
  entries: DrawEntryResult[]
  pools: PrizePools
}
