"use client"
import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ExternalLink, CheckCircle2, ChevronRight } from "lucide-react"
import { WinnerVerificationSheet } from "@/components/admin/winner-verification-sheet"

interface WinnersTableProps {
  initialWinners: any[]
}

export function WinnersTable({ initialWinners }: WinnersTableProps) {
  const [selectedWinner, setSelectedWinner] = React.useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  const handleRowClick = (winner: any) => {
    setSelectedWinner(winner)
    setIsSheetOpen(true)
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Winner</TableHead>
              <TableHead>Draw</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead className="w-25"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialWinners.map((winner) => (
              <TableRow 
                key={winner.id} 
                className="hover:bg-card/40 transition-colors cursor-pointer group"
                onClick={() => handleRowClick(winner)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{winner.profiles?.full_name}</span>
                    <span className="text-xs text-muted-foreground">{winner.profiles?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-tight">
                      {format(new Date(winner.draws?.draw_month), "MMM yyyy")}
                    </span>
                    <Badge variant="outline" className="w-fit text-[8px] uppercase px-1">
                      {winner.tier.replace('_', ' ')}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-black text-primary">
                    £{Number(winner.prize_amount).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className={cn(
                      "w-fit text-[10px] uppercase",
                      winner.verification_status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                      winner.verification_status === 'rejected' ? 'bg-rose-500/10 text-rose-500' : ''
                    )}>
                      {winner.verification_status}
                    </Badge>
                    {winner.proof_url && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic">
                        Proof Attached <CheckCircle2 className="h-2 w-2 text-primary" />
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className={cn(
                     "text-[10px] uppercase",
                     winner.payout_status === 'paid' ? 'bg-primary/20 text-primary border-primary/20' : ''
                   )}>
                     {winner.payout_status}
                   </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end pr-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <WinnerVerificationSheet 
        winner={selectedWinner}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
