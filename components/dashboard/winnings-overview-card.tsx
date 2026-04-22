import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DollarSign, Wallet } from "lucide-react"
import { format } from "date-fns"

interface WinningsOverviewCardProps {
  winners: any[]
}

export function WinningsOverviewCard({ winners }: WinningsOverviewCardProps) {
  const totalWinnings = winners
    .filter((w) => w.verification_status === "approved")
    .reduce((sum, w) => sum + Number(w.prize_amount), 0)

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Your Winnings</CardTitle>
          <CardDescription>History of your draw victories</CardDescription>
        </div>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-4 flex-1">
        <div className="mb-6 flex items-baseline gap-2">
          <span className="text-4xl font-black luma-gradient-text">
            £{totalWinnings.toFixed(2)}
          </span>
          <span className="text-xs font-semibold uppercase text-muted-foreground tracking-widest">
            Total Approved
          </span>
        </div>

        {winners.length > 0 ? (
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-xs">Draw Month</TableHead>
                  <TableHead className="text-xs">Tier</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {winners.map((winner) => (
                  <TableRow key={winner.id}>
                    <TableCell className="py-2.5 text-sm font-medium">
                      {format(new Date(winner.draws?.draw_month), "MMM yyyy")}
                    </TableCell>
                    <TableCell className="py-2.5 text-xs text-muted-foreground capitalize">
                      {winner.tier.replace("_", " ")}
                    </TableCell>
                    <TableCell className="py-2.5 text-right font-bold text-sm">
                      £{Number(winner.prize_amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      <Badge
                        variant="secondary"
                        className={
                          winner.payout_status === "paid"
                            ? "bg-primary/10 text-primary text-[10px]"
                            : "text-[10px]"
                        }
                      >
                        {winner.payout_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center border-2 border-dashed border-border/50 rounded-xl">
            <p className="text-sm text-muted-foreground italic">
              No winnings yet. Stay active to increase your chances!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
