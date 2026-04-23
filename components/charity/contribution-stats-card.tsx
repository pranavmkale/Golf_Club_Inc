import { Heart, Percent, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContributionStatsCardProps {
  totalContributed: number
  charityPercentage: number
  charityName: string
}

export function ContributionStatsCard({
  totalContributed,
  charityPercentage,
  charityName,
}: ContributionStatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-sidebar-border bg-sidebar shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Total contributed
          </CardTitle>
          <div className="h-4 w-4 text-emerald-500">
            <Heart className="h-4 w-4 fill-current" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tabular-nums">
            £{totalContributed.toFixed(2)}
          </div>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">
            Your lifetime impact
          </p>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border bg-sidebar shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Active charity
          </CardTitle>
          <Home className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="truncate text-xl leading-tight font-bold">
            {charityName}
          </div>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground italic">
            Receiving monthly support
          </p>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border bg-sidebar shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            Contribution rate
          </CardTitle>
          <Percent className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tabular-nums">
            {charityPercentage}%
          </div>
          <p className="mt-1 text-[10px] font-medium text-muted-foreground">
            Of your sub price
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
