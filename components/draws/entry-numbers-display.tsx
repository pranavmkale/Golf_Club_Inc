import Link from "next/link"
import { Lock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "../ui/card"

interface EntryNumbersDisplayProps {
  userEntryNumbers: number[] | null
  isSubscribed: boolean
}

export function EntryNumbersDisplay({ userEntryNumbers, isSubscribed }: EntryNumbersDisplayProps) {
  // State A — not subscribed
  if (!isSubscribed) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-sidebar-border bg-sidebar-accent/20 text-center space-y-3 h-full min-h-[160px]">
        <div className="rounded-full bg-sidebar-border p-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Subscribe to enter draws</p>
          <p className="text-xs text-muted-foreground">Premium membership required</p>
        </div>
        <Button asChild size="sm" variant="default">
          <Link href="/settings/subscription">View plans</Link>
        </Button>
      </div>
    )
  }

  // State B — subscribed but fewer than 5 scores
  if (userEntryNumbers === null) {
    return (
      <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-sidebar-border bg-sidebar-accent/10 text-center space-y-3 h-full min-h-[160px]">
        <AlertCircle className="h-6 w-6 text-amber-500" />
        <div className="space-y-1">
          <p className="text-sm font-medium">You need 5 scores to get entry numbers</p>
          <p className="text-xs text-muted-foreground">Head to My Scores to add your rounds.</p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/scores">Add scores</Link>
        </Button>
      </div>
    )
  }

  // State C — has 5 scores
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2 md:grid-cols-5">
        {userEntryNumbers.map((num, i) => (
          <Card 
            key={i}
            className="flex flex-col items-center justify-center aspect-square shadow-none"
          >
            <span className="text-xl font-bold tracking-tight">{num}</span>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <div className="relative flex h-2 w-2">
          <span className="animate-[pulse_2s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Entry confirmed for current draw
        </p>
      </div>
      
      <p className="text-[10px] text-muted-foreground leading-tight">
        Derived from your 5 most recent scores · Updates automatically when you add a new score
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
      `}} />
    </div>
  )
}
