"use client"

import * as React from "react"
import { useTransition } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  approveWinnerAction,
  rejectWinnerAction,
  markAsPaidAction,
} from "@/app/actions/admin"
import { format } from "date-fns"
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  DollarSign,
  Loader2,
  FileText,
} from "lucide-react"
import Image from "next/image"

interface WinnerVerificationSheetProps {
  winner: any
  isOpen: boolean
  onClose: () => void
}

export function WinnerVerificationSheet({
  winner,
  isOpen,
  onClose,
}: WinnerVerificationSheetProps) {
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
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-black tracking-tight uppercase">
              Review Prize Claim
            </SheetTitle>
            <Badge
              variant="outline"
              className="text-[10px] tracking-widest uppercase"
            >
              {winner.verification_status}
            </Badge>
          </div>
          <SheetDescription>
            Validate scorecard proof for {winner.profiles?.full_name}'s{" "}
            {winner.tier.replace("_", " ")} win.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 pb-32">
          {/* User & Prize Summary */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div>
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                User Details
              </Label>
              <p className="mt-1 text-sm font-bold">
                {winner.profiles?.full_name}
              </p>
              <p className="text-xs text-muted-foreground">
                {winner.profiles?.email}
              </p>
            </div>
            <div className="text-right">
              <Label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Prize Amount
              </Label>
              <p className="mt-1 text-lg font-black text-primary">
                £{Number(winner.prize_amount).toFixed(2)}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                {format(new Date(winner.draws?.draw_month), "MMM yyyy")} Draw
              </p>
            </div>
          </div>

          {/* Proof Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
                <FileText className="h-4 w-4 text-primary" />
                Scorecard Proof
              </Label>
              <a
                href={winner.proof_url}
                target="_blank"
                className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase hover:underline"
              >
                Open Original <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl border-2 border-dashed border-border/50 bg-muted/10">
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
                <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground italic opacity-30">
                  No document uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Rejection Feedbacks */}
          {showRejectionInput && (
            <div className="animate-in space-y-3 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 fade-in slide-in-from-top-2">
              <Label
                htmlFor="reason"
                className="text-xs font-bold text-rose-500 uppercase"
              >
                Reason for Rejection
              </Label>
              <Input
                id="reason"
                placeholder="e.g. Scorecard doesn't match entry numbers..."
                className="h-10 border-rose-500/20 bg-background text-sm focus-visible:ring-rose-500"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <p className="text-[10px] text-rose-500 italic">
                This reason will be visible to the user on their dashboard.
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Bar */}
        <SheetFooter className="absolute right-0 bottom-0 left-0 border-t border-border/50 bg-background/80 p-6 backdrop-blur-lg">
          <div className="flex w-full gap-3">
            {winner.verification_status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="h-12 flex-1 text-xs font-bold tracking-widest text-rose-500 uppercase hover:bg-rose-50 hover:text-rose-600"
                  onClick={handleReject}
                  disabled={isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {showRejectionInput ? "Confirm Reject" : "Reject"}
                </Button>
                <Button
                  className="h-12 flex-1 text-xs font-bold tracking-widest uppercase shadow-xl shadow-primary/20"
                  onClick={handleApprove}
                  disabled={isPending || showRejectionInput}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Approve Claim
                </Button>
              </>
            )}

            {winner.verification_status === "approved" &&
              winner.payout_status === "pending" && (
                <Button
                  className="h-12 w-full bg-green-600 text-xs font-bold tracking-widest uppercase shadow-xl shadow-green-500/20 hover:bg-green-700"
                  onClick={handleMarkPaid}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <DollarSign className="mr-2 h-4 w-4" />
                  )}
                  Confirm Payout
                </Button>
              )}

            {winner.payout_status === "paid" && (
              <div className="flex h-12 w-full items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                PAYMENT COMPLETE
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
