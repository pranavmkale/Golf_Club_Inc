import { format } from "date-fns"
import type { Draw, DrawEntry } from "@/lib/types/database"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DrawResultCardProps {
  draw: Draw
  userEntry: DrawEntry | null
}

export function DrawResultCard({ draw, userEntry }: DrawResultCardProps) {
  const winningNumbers = draw.winning_numbers || []
  const userEntryNumbers = userEntry?.entry_numbers || []

  const isWinner =
    userEntry && userEntry.tier !== "none" && userEntry.tier !== null
  const matchCount = userEntry?.matched_count || 0

  return (
    <div className="transition-hover flex flex-col items-start justify-between gap-6 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm hover:border-primary/20 sm:flex-row sm:items-center">
      {/* Left: Month + year */}
      <div className="min-w-[140px] space-y-1">
        <p className="text-lg leading-tight font-bold tracking-tight uppercase">
          {format(new Date(draw.draw_month), "MMMM yyyy")}
        </p>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          Published{" "}
          {draw.published_at
            ? format(new Date(draw.published_at), "MMM d, yyyy")
            : "N/A"}
        </p>
      </div>

      {/* Center: Winning numbers */}
      <div className="flex w-full flex-1 flex-col gap-2 sm:w-auto">
        <p className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
          Winning numbers
        </p>
        <div className="flex flex-wrap gap-1.5">
          {winningNumbers.length > 0 ? (
            winningNumbers.map((num, i) => {
              // Ensure type-safe comparison (JSONB can return strings)
              const isMatch = userEntryNumbers.some(
                (entryNum) => Number(entryNum) === Number(num)
              )
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold tabular-nums shadow-sm transition-all",
                    isMatch
                      ? "scale-105 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-sidebar-border bg-sidebar-accent/30 text-muted-foreground"
                  )}
                >
                  {num}
                </div>
              )
            })
          ) : (
            <p className="text-xs text-muted-foreground italic">
              Results pending
            </p>
          )}
        </div>
      </div>

      {/* Right: Result badge */}
      <div className="mt-2 flex w-full shrink-0 flex-col items-start gap-1 sm:mt-0 sm:w-auto sm:items-end">
        {!userEntry ? (
          <Badge
            variant="outline"
            className="border-sidebar-border bg-sidebar-accent/10 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
          >
            Not entered
          </Badge>
        ) : (
          <>
            <Badge
              variant={isWinner ? "default" : "secondary"}
              className={cn(
                "py-1 text-[10px] font-bold tracking-wider uppercase",
                userEntry.tier === "jackpot" &&
                  "border-amber-400/50 bg-amber-500 text-white hover:bg-amber-600",
                userEntry.tier === "tier_4" &&
                  "bg-emerald-500 text-white hover:bg-emerald-600",
                userEntry.tier === "tier_3" &&
                  "bg-blue-500 text-white hover:bg-blue-600",
                userEntry.tier === "none" &&
                  "bg-sidebar-accent text-muted-foreground"
              )}
            >
              {userEntry.tier === "jackpot" && "JACKPOT"}
              {userEntry.tier === "tier_4" && "4-Match Win"}
              {userEntry.tier === "tier_3" && "3-Match Win"}
              {userEntry.tier === "none" && "No match"}
            </Badge>
            <p className="text-[10px] font-medium text-muted-foreground tabular-nums">
              Matched {matchCount} number{matchCount !== 1 ? "s" : ""}
            </p>
            <p className="text-[10px] text-muted-foreground tabular-nums">
              Your entry: {userEntryNumbers.join(", ")}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
