import { format } from "date-fns"
import { Receipt } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EmptyState } from "@/components/ui/empty-state"
import type { CharityContribution, Charity } from "@/lib/types/database"

interface ContributionWithCharity extends CharityContribution {
  charity: Pick<Charity, "name" | "logo_url">
}

interface ContributionHistoryListProps {
  contributions: ContributionWithCharity[]
}

export function ContributionHistoryList({ contributions }: ContributionHistoryListProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight">Contribution history</h3>
        <p className="text-sm text-muted-foreground italic">
          Track the monthly impact of your subscriptions.
        </p>
      </div>

      {contributions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-sidebar-border bg-sidebar-accent/10 p-12">
          <EmptyState
            icon={Receipt}
            title="No contributions yet"
            description="Your contribution history will appear here after your first subscription payment."
          />
        </div>
      ) : (
        <div className="space-y-2">
          {contributions.map((contribution) => (
            <div
              key={contribution.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-sidebar-border bg-sidebar px-4 py-3 shadow-sm transition-hover hover:border-primary/20"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border/10">
                  <AvatarImage src={contribution.charity.logo_url || ""} />
                  <AvatarFallback className="text-[10px] font-bold">
                    {contribution.charity.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold truncate leading-tight">
                    {contribution.charity.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider">
                    {format(new Date(contribution.period_start), "MMMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-black tabular-nums tracking-tight">
                  £{contribution.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground italic px-2 pt-2">
            * Contributions are processed automatically with each subscription renewal.
          </p>
        </div>
      )}
    </div>
  )
}
