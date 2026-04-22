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
      <Card className="bg-sidebar border-sidebar-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Total contributed
          </CardTitle>
          <div className="h-4 w-4 text-emerald-500">
            <Heart className="h-4 w-4 fill-current" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tabular-nums">£{totalContributed.toFixed(2)}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Your lifetime impact</p>
        </CardContent>
      </Card>

      <Card className="bg-sidebar border-sidebar-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Active charity
          </CardTitle>
          <Home className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold truncate leading-tight">{charityName}</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">Receiving monthly support</p>
        </CardContent>
      </Card>

      <Card className="bg-sidebar border-sidebar-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Contribution rate
          </CardTitle>
          <Percent className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black tabular-nums">{charityPercentage}%</div>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">Of your sub price</p>
        </CardContent>
      </Card>
    </div>
  )
}
