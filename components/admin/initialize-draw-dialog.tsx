"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PlayCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { format, addMonths } from "date-fns"

const DRAW_TYPES = [
  { value: "random", label: "Random Generation" },
  { value: "algorithmic", label: "Algorithmic (Most Frequent)" },
]

export function InitializeDrawDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [drawMonth, setDrawMonth] = useState(format(new Date(), "yyyy-MM-dd"))
  const [drawType, setDrawType] = useState("random")
  const [simulate, setSimulate] = useState(false)

  // Generate next 12 months for selection (use first day of month for DB compatibility)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(), i)
    return {
      value: format(date, "yyyy-MM-dd"),
      label: format(date, "MMMM yyyy"),
    }
  })

  const handleInitialize = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/draws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drawMonth,
          drawType,
          simulate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to initialize draw")
      }

      if (simulate) {
        toast.success("Simulation completed", {
          description: `Generated ${data.eligibleEntries} eligible entries. Jackpot winners: ${data.winners.jackpot}`,
        })
      } else {
        toast.success("Draw initialized successfully", {
          description: `Draw ID: ${data.drawId}`,
        })
        router.refresh()
        setOpen(false)
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <PlayCircle className="h-4 w-4" />
          Initialize New Draw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Initialize New Draw</DialogTitle>
          <DialogDescription>
            Configure and run a new monthly draw. Choose between simulation mode
            (preview only) or actual execution.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="draw-month">Draw Month</Label>
            <Select value={drawMonth} onValueChange={setDrawMonth}>
              <SelectTrigger id="draw-month">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="draw-type">Draw Type</Label>
            <Select value={drawType} onValueChange={setDrawType}>
              <SelectTrigger id="draw-type">
                <SelectValue placeholder="Select draw type" />
              </SelectTrigger>
              <SelectContent>
                {DRAW_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="simulate">Simulation Mode</Label>
              <p className="text-xs text-muted-foreground">
                Preview results without saving to database
              </p>
            </div>
            <Switch
              id="simulate"
              checked={simulate}
              onCheckedChange={setSimulate}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleInitialize}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : simulate ? (
              <>
                <PlayCircle className="h-4 w-4" />
                Run Simulation
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                Initialize Draw
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
