"use client"

import * as React from "react"
import { ChevronDown, Info } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

export function HowDrawWorksInfo() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full rounded-xl border border-sidebar-border bg-sidebar px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-bold tracking-tight">
            How does the draw work?
          </h4>
        </div>
        <CollapsibleTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-sidebar-accent">
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
            <span className="sr-only">Toggle info</span>
          </button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/10 p-3">
            <h5 className="text-xs font-bold tracking-widest text-primary/80 uppercase">
              1. Entry
            </h5>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Your entries are automatic. We take your 5 most recent Stableford
              scores and use them as your personal entry numbers for the monthly
              draw.
            </p>
          </div>
          <div className="space-y-1.5 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/10 p-3">
            <h5 className="text-xs font-bold tracking-widest text-primary/80 uppercase">
              2. Monthly Draw
            </h5>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              The draw runs on the 1st of every month. Winning numbers are
              derived from a verifiable transparent process or external golf
              data.
            </p>
          </div>
          <div className="space-y-1.5 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/10 p-3">
            <h5 className="text-xs font-bold tracking-widest text-primary/80 uppercase">
              3. Matching
            </h5>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              Prizes are awarded for matching 3, 4, or all 5 numbers. The more
              you match, the higher the tier and the larger the share of the
              prize pool.
            </p>
          </div>
          <div className="space-y-1.5 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/10 p-3">
            <h5 className="text-xs font-bold tracking-widest text-primary/80 uppercase">
              4. Jackpot Rollover
            </h5>
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              If no one matches all 5 numbers, the jackpot rolls over to the
              next month, making it even bigger for future active subscribers.
            </p>
          </div>
        </div>
        <p className="px-1 text-[11px] text-muted-foreground italic">
          Active membership is required at the time of the draw to be eligible
          for prizes.
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}
