import { History } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { DrawResultCard } from "./draw-result-card"
import type { Draw, DrawEntry } from "@/lib/types/database"

interface PastDrawsListProps {
  pastDraws: Array<Draw & { userEntry: DrawEntry | null }>
}

export function PastDrawsList({ pastDraws }: PastDrawsListProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight">Past draws</h3>
        <p className="text-sm text-muted-foreground italic">
          Your participation history and results.
        </p>
      </div>

      {pastDraws.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sidebar-border bg-sidebar-accent/10 p-12">
          <EmptyState
            icon={History}
            title="No draw history yet"
            description="Your results will appear here after each monthly draw."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {pastDraws.map((draw) => (
            <DrawResultCard
              key={draw.id}
              draw={draw}
              userEntry={draw.userEntry}
            />
          ))}
        </div>
      )}
    </div>
  )
}
