"use client"

import * as React from "react"
import { useTransition } from "react"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { approveWinnerAction, rejectWinnerAction, markAsPaidAction } from "@/app/actions/admin"
import { format } from "date-fns"
import { ExternalLink, CheckCircle2, XCircle, DollarSign, Loader2, FileText } from "lucide-react"
import Image from "next/image"

interface WinnerVerificationSheetProps {
  winner: any
  isOpen: boolean
  onClose: () => void
}

export function WinnerVerificationSheet({ winner, isOpen, onClose }: WinnerVerificationSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectionReason, setRejectionReason] = React.useState("")
  const [showRejectionInput, setShowRejectionInput] = React.useState(false)

  if (!winner) return null

  const isPdf = winner.proof_url?.toLowerCase().endsWith(".pdf")

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await approveWinnerAction(winner.id)
        onClose()
      } catch (error) {
        console.error("Approval error", error)
      }
    })
  }

  const handleReject = () => {
    if (!rejectionReason) {
      setShowRejectionInput(true)
      return
    }
    startTransition(async () => {
      try {
        await rejectWinnerAction(winner.id, rejectionReason)
        onClose()
      } catch (error) {
        console.error("Rejection error", error)
      }
    })
  }

  const handleMarkPaid = () => {
    startTransition(async () => {
      try {
        await markAsPaidAction(winner.id)
        onClose()
      } catch (error) {
        console.error("Payout error", error)
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black uppercase tracking-tight">Review Prize Claim</SheetTitle>
            <Badge variant="outline" className="uppercase text-[10px] tracking-widest">
              {winner.verification_status}
            </Badge>
          </div>
          <SheetDescription>
            Validate scorecard proof for {winner.profiles?.full_name}'s {winner.tier.replace('_', ' ')} win.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 pb-32">
          {/* User & Prize Summary */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div>
              <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">User Details</Label>
              <p className="text-sm font-bold mt-1">{winner.profiles?.full_name}</p>
              <p className="text-xs text-muted-foreground">{winner.profiles?.email}</p>
            </div>
            <div className="text-right">
              <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Prize Amount</Label>
              <p className="text-lg font-black text-primary mt-1">£{Number(winner.prize_amount).toFixed(2)}</p>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                {format(new Date(winner.draws?.draw_month), "MMM yyyy")} Draw
              </p>
            </div>
          </div>

          {/* Proof Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold uppercase tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Scorecard Proof
              </Label>
              <a 
                href={winner.proof_url} 
                target="_blank" 
                className="text-[10px] font-bold text-primary uppercase flex items-center gap-1 hover:underline"
              >
                Open Original <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="aspect-[3/4] relative w-full rounded-2xl border-2 border-dashed border-border/50 bg-muted/10 overflow-hidden">
              {winner.proof_url ? (
                isPdf ? (
                  <iframe 
                    src={`${winner.proof_url}#toolbar=0`} 
                    className="h-full w-full"
                    title="PDF Proof"
                  />
                ) : (
                  <Image 
                    src={winner.proof_url} 
                    alt="Winner Proof" 
                    fill 
                    className="object-contain p-2"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-30 italic text-sm">
                  No document uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Rejection Feedbacks */}
          {showRejectionInput && (
            <div className="space-y-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="reason" className="text-xs font-bold text-rose-500 uppercase">Reason for Rejection</Label>
              <Input 
                id="reason" 
                placeholder="e.g. Scorecard doesn't match entry numbers..." 
                className="bg-background border-rose-500/20 focus-visible:ring-rose-500 h-10 text-sm"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <p className="text-[10px] text-rose-500 italic">This reason will be visible to the user on their dashboard.</p>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-lg border-t border-border/50">
          <div className="flex w-full gap-3">
            {winner.verification_status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                  onClick={handleReject}
                  disabled={isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {showRejectionInput ? "Confirm Reject" : "Reject"}
                </Button>
                <Button 
                  className="flex-1 h-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20"
                  onClick={handleApprove}
                  disabled={isPending || showRejectionInput}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Approve Claim
                </Button>
              </>
            )}

            {winner.verification_status === 'approved' && winner.payout_status === 'pending' && (
              <Button 
                className="w-full h-12 text-xs font-bold uppercase tracking-widest shadow-xl shadow-green-500/20 bg-green-600 hover:bg-green-700"
                onClick={handleMarkPaid}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <DollarSign className="h-4 w-4 mr-2" />}
                Confirm Payout
              </Button>
            )}

            {winner.payout_status === 'paid' && (
              <div className="w-full h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                PAYMENT COMPLETE
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
