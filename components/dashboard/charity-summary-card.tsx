import Link from "next/link"
import { Heart, ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { calculateContribution } from "@/lib/charity/contributions"

interface CharitySummaryCardProps {
  charity: any
  percentage: number
  isSubscribed: boolean
}

export function CharitySummaryCard({
  charity,
  percentage,
  isSubscribed,
}: CharitySummaryCardProps) {
  const monthlyImpact = isSubscribed ? calculateContribution(5, percentage) : 0

  return (
    <Card className="flex h-full flex-col border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Charity Impact</CardTitle>
          <CardDescription>Your support makes a difference</CardDescription>
        </div>
        <Heart className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        {charity ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-lg border border-border/50">
                <AvatarImage src={charity.logo_url} alt={charity.name} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  {charity.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5">
                <p className="font-bold">{charity.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {charity.description}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Monthly Contribution
                </span>
                <span className="font-bold text-primary">
                  {percentage}% (
                  {isSubscribed ? `£${monthlyImpact.toFixed(2)}` : "Inactive"})
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted/30">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <p className="text-center text-sm text-muted-foreground italic">
              No charity selected. Join a cause to start contributing!
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-border/10 pt-4">
        <Link
          href="/settings/charity"
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          {charity ? "Explore other charities" : "Select a charity"}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}
