import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dices, CheckCircle2, XCircle, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, addMonths, startOfMonth } from "date-fns"

interface DrawStatusCardProps {
  eligible: boolean
  entryNumbers: number[]
  lastWinner?: any
}

export function DrawStatusCard({ eligible, entryNumbers, lastWinner }: DrawStatusCardProps) {
  // Logic: Draft day is always the 1st of next month
  const nextDrawDate = startOfMonth(addMonths(new Date(), 1))

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Draw Eligibility</CardTitle>
          <CardDescription>Status for {format(nextDrawDate, "MMMM yyyy")} draw</CardDescription>
        </div>
        <Dices className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-4 flex-1 space-y-6">
        {/* Eligibility Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {eligible ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground/50" />
            )}
            <span className={eligible ? "font-bold text-foreground" : "text-muted-foreground"}>
              {eligible ? "Eligible for Draw" : "Not yet eligible"}
            </span>
          </div>
          <Badge variant={eligible ? "default" : "outline"} className={eligible ? "bg-primary/20 text-primary border-primary/30" : ""}>
            {eligible ? "READY" : "LOCKED"}
          </Badge>
        </div>

        {/* Entry Numbers */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">Your Entry Numbers</p>
          <div className="flex gap-2">
            {eligible ? (
              entryNumbers.map((num, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 font-black text-primary shadow-inner"
                >
                  {num}
                </div>
              ))
            ) : (
              <div className="flex gap-2 opacity-30 italic text-sm">
                Submit 5 scores to generate numbers
              </div>
            )}
          </div>
        </div>

        {/* Last Win Highlight */}
        {lastWinner && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
            <Trophy className="h-4 w-4 text-primary animate-bounce" />
            <div className="text-sm">
              <span className="font-bold text-primary">WINNER!</span> Last month you won{" "}
              <span className="font-black">£{Number(lastWinner.prize_amount).toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
