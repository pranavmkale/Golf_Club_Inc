"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface DrawActionsProps {
  drawId: string
  drawStatus: string
}

export function DrawActions({ drawId, drawStatus }: DrawActionsProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    try {
      const response = await fetch(`/api/admin/draws/${drawId}/publish`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish draw")
      }

      toast.success("Draw published successfully", {
        description: `Published at: ${new Date(data.publishedAt).toLocaleString()}`,
      })

      setShowConfirm(false)
      router.refresh()
    } catch (error: any) {
      toast.error("Error publishing draw", {
        description: error.message,
      })
    } finally {
      setPublishing(false)
    }
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              asChild
            >
              <Link href={`/admin/draws/${drawId}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>View draw details</p>
          </TooltipContent>
        </Tooltip>

        {drawStatus !== "published" && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => setShowConfirm(true)}
                  disabled={publishing}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Publish draw & notify winners</p>
              </TooltipContent>
            </Tooltip>

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Publish Draw
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to publish this draw? This action cannot be undone.
                    Winners will be notified via email and the draw results will be made public.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                    disabled={publishing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={publishing}
                    className="gap-2"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Publish Draw
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
