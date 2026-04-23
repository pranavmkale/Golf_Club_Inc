import type { Score } from "@/lib/types/database"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, AlertCircle, CheckCircle2 } from "lucide-react"

interface DrawEligibilityBannerProps {
  scoreCount: number
  scores?: Score[]
}

export function DrawEligibilityBanner({
  scoreCount,
  scores = [],
}: DrawEligibilityBannerProps) {
  // State A — no scores
  if (scoreCount === 0) {
    return (
      <Alert className="border-border/50 bg-muted/30">
        <ClipboardList className="h-4 w-4" />
        <AlertTitle>No scores yet</AlertTitle>
        <AlertDescription>
          Add your first Stableford score to get started. You need 5 scores to
          enter the monthly draw.
        </AlertDescription>
      </Alert>
    )
  }

  // State B — 1–4 scores
  if (scoreCount < 5) {
    const needed = 5 - scoreCount
    return (
      <Alert className="border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 [&>svg]:text-amber-500">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-amber-600 dark:text-amber-400">
          Almost there — {needed} more score{needed !== 1 ? "s" : ""} needed
        </AlertTitle>
        <AlertDescription className="space-y-3 text-amber-600/80 dark:text-amber-400/80">
          <p>
            Once you have 5 scores saved, your latest 5 automatically become
            your draw entry numbers each month.
          </p>
          {/* Progress circles */}
          <div className="flex items-center gap-2 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={[
                  "h-4 w-4 rounded-full border-2 transition-all",
                  i < scoreCount
                    ? "border-amber-500 bg-amber-500"
                    : "border-amber-500/30 bg-transparent",
                ].join(" ")}
              />
            ))}
            <span className="ml-1 text-xs font-medium">{scoreCount}/5</span>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // State C — 5 scores
  const entryNumbers = scores
    .slice(0, 5)
    .map((s) => s.score)
    .sort((a, b) => a - b)

  return (
    <Alert className="border-emerald-500/30 bg-emerald-500/5 [&>svg]:text-emerald-500">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle className="text-emerald-600 dark:text-emerald-400">
        You&apos;re entered in this month&apos;s draw 🎉
      </AlertTitle>
      <AlertDescription className="space-y-2 text-emerald-600/80 dark:text-emerald-400/80">
        <p>Your draw entry numbers are:</p>
        <div className="flex flex-wrap gap-1.5">
          {entryNumbers.map((num, i) => (
            <Badge
              key={i}
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 px-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400"
            >
              {num}
            </Badge>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
