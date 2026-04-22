"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { selectCharityAction } from "@/app/actions/charity"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CharityBrowserGrid } from "./charity-browser-grid"
import type { Charity } from "@/lib/types/database"

interface CharityBrowserDialogProps {
  charities: Charity[]
  currentCharityId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CharityBrowserDialog({
  charities,
  currentCharityId,
  open,
  onOpenChange,
  onSuccess,
}: CharityBrowserDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const filteredCharities = charities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirm = () => {
    if (!selectedId) return
    
    startTransition(async () => {
      try {
        const result = await selectCharityAction(selectedId)
        if (result.success) {
          toast.success("Charity updated!")
          onSuccess()
          onOpenChange(false)
        } else {
          toast.error(result.error || "Failed to update charity")
        }
      } catch (error) {
        toast.error("An unexpected error occurred")
      }
    })
  }

  // Reset state when dialog closes/opens
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setSelectedId(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="p-6 pb-2">
          <DialogHeader className="mb-4">
            <DialogTitle>Choose a charity</DialogTitle>
            <DialogDescription>
              Select a charity to receive your monthly contribution.
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search charities..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-6 pb-2">
          <CharityBrowserGrid
            charities={filteredCharities}
            currentCharityId={currentCharityId}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="p-6 pt-2 border-t bg-muted/20 flex flex-col sm:flex-row-reverse gap-2">
          <Button
            onClick={handleConfirm}
            disabled={!selectedId || isPending}
            className="sm:min-w-[140px]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm selection"
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
