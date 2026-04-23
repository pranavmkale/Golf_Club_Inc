"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { updateCharityPercentageAction } from "@/app/actions/charity"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface CharityPercentageSliderProps {
  currentPercentage: number
  subscriptionAmount: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CharityPercentageSlider({
  currentPercentage,
  subscriptionAmount,
  open,
  onOpenChange,
  onSuccess,
}: CharityPercentageSliderProps) {
  const [value, setValue] = React.useState([currentPercentage])
  const [isPending, startTransition] = React.useTransition()

  const calculatedAmount = (subscriptionAmount * (value[0] / 100)).toFixed(2)

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await updateCharityPercentageAction(value[0])
        if (result.success) {
          toast.success("Contribution percentage updated")
          onSuccess()
          onOpenChange(false)
        } else {
          toast.error(result.error || "Failed to update percentage")
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
      }
    })
  }

  // Reset value when dialog opens
  React.useEffect(() => {
    if (open) {
      setValue([currentPercentage])
    }
  }, [open, currentPercentage])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust your contribution</DialogTitle>
          <DialogDescription>
            Choose how much of your subscription goes to charity. Minimum is
            10%.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center space-y-8 py-8">
          <div className="space-y-1 text-center">
            <span className="text-6xl font-black tracking-tighter tabular-nums">
              {value[0]}%
            </span>
            <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Contribution rate
            </p>
          </div>

          <div className="w-full px-4">
            <Slider
              value={value}
              onValueChange={setValue}
              min={10}
              max={100}
              step={5}
              disabled={isPending}
              className="py-4"
            />
            <div className="mt-2 flex justify-between px-1">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                10% min
              </span>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                100% max
              </span>
            </div>
          </div>

          <div className="w-full space-y-1 rounded-xl border border-primary/10 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">
              At {value[0]}%, you&apos;ll contribute approximately
            </p>
            <p className="text-2xl font-bold tracking-tight">
              £{calculatedAmount}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                per month
              </span>
            </p>
          </div>

          <p className="px-4 text-center text-[11px] leading-relaxed text-muted-foreground italic">
            Moving the slider changes your charity %, effective from your next
            billing period.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="sm:min-w-[100px]"
          >
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
      </DialogContent>
    </Dialog>
  )
}
