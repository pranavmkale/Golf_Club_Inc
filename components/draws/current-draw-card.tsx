import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Draw } from "@/lib/types/database"
import { EntryNumbersDisplay } from "./entry-numbers-display"

interface CurrentDrawCardProps {
  nextDrawDate: string
  userEntryNumbers: number[] | null
  isSubscribed: boolean
  latestDraw: Draw | null
}

export function CurrentDrawCard({ 
  nextDrawDate, 
  userEntryNumbers, 
  isSubscribed, 
  latestDraw 
}: CurrentDrawCardProps) {
  const isEligible = isSubscribed && userEntryNumbers !== null

  return (
    <Card className="overflow-hidden border-sidebar-border bg-sidebar px-2 shadow-none p-0">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">This month&apos;s draw</CardTitle>
          <CardDescription>{nextDrawDate}</CardDescription>
        </div>
        <Badge 
          variant={isEligible ? "default" : "outline"}
          className={isEligible ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""}
        >
          {isEligible ? "Entries open" : "Not eligible"}
        </Badge>
      </CardHeader>
      
      <CardContent className="grid gap-8 md:grid-cols-2 pb-8">
        {/* Left: Entry Numbers */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-tight">Your entry numbers</h4>
          <EntryNumbersDisplay 
            userEntryNumbers={userEntryNumbers} 
            isSubscribed={isSubscribed} 
          />
        </div>

        {/* Right: Prize Pools */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-tight">Prize pools this month</h4>
          <div className="space-y-3">
            {[
              { label: "Jackpot", share: "40% of pool", badge: "Rolls over if unclaimed" },
              { label: "4-Match", share: "35% of pool" },
              { label: "3-Match", share: "25% of pool" },
            ].map((prize) => (
              <div key={prize.label} className="flex items-center justify-between py-2 border-b border-sidebar-border/50 last:border-0">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{prize.label}</p>
                  <p className="text-xs text-muted-foreground">{prize.share}</p>
                </div>
                {prize.badge && (
                  <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2">
                    {prize.badge}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground italic">
            Note: Prize pool calculated from active subscriber count. Exact amounts published with draw results.
          </p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-sidebar-border/50 bg-sidebar-accent/30 pb-4 text-xs text-muted-foreground">
        Draw runs on the 1st of each month. Your 5 latest scores automatically update your entry numbers when you add a new score.
      </CardFooter>
    </Card>
  )
}
