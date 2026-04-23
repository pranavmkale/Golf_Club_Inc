import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Dices, CheckCircle2, XCircle, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format, addMonths, startOfMonth } from "date-fns"

interface DrawStatusCardProps {
  eligible: boolean
  entryNumbers: number[]
  lastWinner?: any
}

export function DrawStatusCard({
  eligible,
  entryNumbers,
  lastWinner,
}: DrawStatusCardProps) {
  // Logic: Draft day is always the 1st of next month
  const nextDrawDate = startOfMonth(addMonths(new Date(), 1))

  return (
    <Card className="flex h-full flex-col border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Draw Eligibility</CardTitle>
          <CardDescription>
            Status for {format(nextDrawDate, "MMMM yyyy")} draw
          </CardDescription>
        </div>
        <Dices className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 space-y-6 pt-4">
        {/* Eligibility Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {eligible ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <XCircle className="h-5 w-5 text-muted-foreground/50" />
            )}
            <span
              className={
                eligible ? "font-bold text-foreground" : "text-muted-foreground"
              }
            >
              {eligible ? "Eligible for Draw" : "Not yet eligible"}
            </span>
          </div>
          <Badge
            variant={eligible ? "default" : "outline"}
            className={
              eligible ? "border-primary/30 bg-primary/20 text-primary" : ""
            }
          >
            {eligible ? "READY" : "LOCKED"}
          </Badge>
        </div>

        {/* Entry Numbers */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Your Entry Numbers
          </p>
          <div className="flex gap-2">
            {eligible ? (
              entryNumbers.map((num, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-black text-primary shadow-inner"
                >
                  {num}
                </div>
              ))
            ) : (
              <div className="flex gap-2 text-sm italic opacity-30">
                Submit 5 scores to generate numbers
              </div>
            )}
          </div>
        </div>

        {/* Last Win Highlight */}
        {lastWinner && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <Trophy className="h-4 w-4 animate-bounce text-primary" />
            <div className="text-sm">
              <span className="font-bold text-primary">WINNER!</span> Last month
              you won{" "}
              <span className="font-black">
                £{Number(lastWinner.prize_amount).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
