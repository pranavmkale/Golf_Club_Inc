import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Score } from "@/lib/types/database"

interface ScoreCardProps {
  scores: Score[]
}

export function ScoreCard({ scores }: ScoreCardProps) {
  // Sort chronologically for the bar chart (oldest to newest)
  const chartScores = [...scores]
    .sort(
      (a, b) =>
        new Date(a.played_on).getTime() - new Date(b.played_on).getTime()
    )
    .slice(-5)

  const latestScores = [...scores].sort(
    (a, b) => new Date(b.played_on).getTime() - new Date(a.played_on).getTime()
  )

  const avgScore =
    scores.length > 0
      ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)
      : "0.0"

  const latest = latestScores[0]?.score
  const previous = latestScores[1]?.score

  let trend: "up" | "down" | "stable" = "stable"
  if (latest && previous) {
    if (latest > previous) trend = "up"
    else if (latest < previous) trend = "down"
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-background shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="luma-gradient-text text-3xl font-extrabold">
              {avgScore}
            </p>
            <p className="text-xs text-muted-foreground">Average Score</p>
            <div className="mt-2 flex items-center gap-1">
              {trend === "up" && (
                <TrendingUp className="h-4 w-4 text-destructive" />
              )}
              {trend === "down" && (
                <TrendingDown className="h-4 w-4 text-primary" />
              )}
              {trend === "stable" && (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs font-semibold">
                {trend === "stable"
                  ? "No change"
                  : trend === "up"
                    ? "Trending Up"
                    : "Trending Down"}
              </span>
            </div>
          </div>

          <div className="flex h-24 items-end gap-2 pb-1">
            {/* Simple CSS-based bar chart */}
            {chartScores.length > 0 ? (
              chartScores.map((s, i) => (
                <div
                  key={s.id}
                  className="group relative flex flex-col items-center gap-1"
                >
                  <div
                    className="w-4 rounded-t-sm bg-gradient-to-t from-primary to-primary/60 transition-all hover:to-primary/40"
                    style={{ height: `${(s.score / 45) * 100}%` }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 rounded bg-popover px-1.5 py-0.5 text-[10px] text-popover-foreground shadow-sm transition-all group-hover:scale-100">
                    {s.score}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full w-32 items-center justify-center rounded bg-muted/20 text-[10px] text-muted-foreground/40 italic">
                Data pending...
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
