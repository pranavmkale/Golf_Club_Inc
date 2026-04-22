"use client"

import * as React from "react"
import { useActionState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateScoreAction } from "@/app/actions/scores"
import { cn } from "@/lib/utils"
import type { Score } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ScoreEditDialogProps {
  score: Score
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ScoreEditDialog({ score, open, onOpenChange, onSuccess }: ScoreEditDialogProps) {
  const [date, setDate] = React.useState<Date>(new Date(score.played_on))

  // Bind scoreId to create a useActionState-compatible action
  const boundAction = updateScoreAction.bind(null, score.id)
  const [state, formAction, isPending] = useActionState(boundAction, null)

  React.useEffect(() => {
    if (state?.success) {
      toast.success("Score updated")
      onSuccess()
      onOpenChange(false)
    }
  }, [state?.success]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset date when score changes
  React.useEffect(() => {
    setDate(new Date(score.played_on))
  }, [score.id, score.played_on])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit score</DialogTitle>
          <DialogDescription>
            Update your Stableford score for this round.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Score input */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-score">Stableford score</Label>
            <Input
              id="edit-score"
              name="score"
              type="number"
              min={1}
              max={45}
              defaultValue={score.score}
              required
              disabled={isPending}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-muted-foreground">Must be between 1 and 45</p>
          </div>

          {/* Date picker */}
          <div className="space-y-1.5">
            <Label>Date played</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal")}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "EEEE, d MMMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(d) => d > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <input
              type="hidden"
              name="date"
              value={date?.toISOString().split("T")[0]}
            />
          </div>

          {/* Error */}
          {state?.error && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
