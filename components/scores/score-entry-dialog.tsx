"use client"

import * as React from "react"
import { useActionState, useTransition } from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { addScoreAction } from "@/app/actions/scores"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface ScoreEntryDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function ScoreEntryDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  trigger,
}: ScoreEntryDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date>(new Date())
  const [state, formAction, isPending] = useActionState(addScoreAction, null)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen : setInternalOpen

  // Close + toast on success
  React.useEffect(() => {
    if (state?.success) {
      toast.success("Score added successfully")
      onSuccess?.()
      setOpen?.(false)
    }
  }, [state?.success, onSuccess, setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <span className="inline-flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="shrink-0 gap-2">
                    <Plus className="h-4 w-4" />
                    Add score
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="border-border/50 bg-background/95 backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a score</DialogTitle>
          <DialogDescription>
            Enter your Stableford score for a round you played.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-5">
          {/* Score input */}
          <div className="space-y-1.5">
            <Label htmlFor="entry-score">Stableford score</Label>
            <Input
              id="entry-score"
              name="score"
              type="number"
              min={1}
              max={45}
              placeholder="e.g. 36"
              required
              disabled={isPending}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <p className="text-xs text-muted-foreground">
              Must be between 1 and 45
            </p>
          </div>

          {/* Date picker */}
          <div className="space-y-1.5">
            <Label>Date played</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isPending}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "EEEE, d MMMM yyyy") : "Pick a date"}
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

          {/* Error message */}
          {state?.error && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen?.(false)}
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
                "Save score"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
