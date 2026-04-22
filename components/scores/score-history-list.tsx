"use client"

import * as React from "react"
import { format } from "date-fns"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteScoreAction } from "@/app/actions/scores"
import type { Score } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ScoreEditDialog } from "./score-edit-dialog"

interface ScoreHistoryListProps {
  scores: Score[]
}

function getScoreColor(score: number): string {
  if (score <= 15) return "bg-primary/30"
  if (score <= 30) return "bg-primary/60"
  return "bg-primary"
}

function ScoreBar({ score }: { score: number }) {
  const percent = Math.round((score / 45) * 100)
  return (
    <div className="flex-1 flex items-center gap-2 min-w-0">
      <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getScoreColor(score)}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-8 shrink-0 text-right">
        {percent}%
      </span>
    </div>
  )
}

export function ScoreHistoryList({ scores }: ScoreHistoryListProps) {
  const [editScore, setEditScore] = React.useState<Score | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Score | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  if (scores.length === 0) return null

  const oldestScore = [...scores].sort(
    (a, b) => new Date(a.played_on).getTime() - new Date(b.played_on).getTime()
  )[0]

  const wouldDropBelowFive = scores.length === 5

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      const result = await deleteScoreAction(deleteTarget.id)
      if (result?.success) {
        toast.success("Score deleted")
      } else {
        toast.error(result?.error ?? "Failed to delete score")
      }
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
          Score history
        </p>

        <ul className="space-y-2">
          {scores.map((score) => (
            <li
              key={score.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/50 px-4 py-3 transition-colors hover:bg-card/80"
            >
              {/* Left: date + score */}
              <div className="w-20 shrink-0 space-y-0.5">
                <p className="text-[11px] font-medium text-muted-foreground">
                  {format(new Date(score.played_on), "EEE d MMM")}
                </p>
                <p className="text-2xl font-black tabular-nums leading-none">
                  {score.score}
                </p>
              </div>

              {/* Center: visual bar */}
              <ScoreBar score={score.score} />

              {/* Right: actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditScore(score)}
                  aria-label="Edit score"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteTarget(score)}
                  aria-label="Delete score"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {/* Oldest score warning */}
        {scores.length === 5 && (
          <p className="text-xs text-muted-foreground px-1">
            Adding a new score will automatically remove your oldest score
            (played on{" "}
            <span className="font-medium">
              {format(new Date(oldestScore.played_on), "d MMMM yyyy")}
            </span>
            ).
          </p>
        )}
      </div>

      {/* Edit dialog */}
      {editScore && (
        <ScoreEditDialog
          score={editScore}
          open={!!editScore}
          onOpenChange={(open) => { if (!open) setEditScore(null) }}
          onSuccess={() => setEditScore(null)}
        />
      )}

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this score?</AlertDialogTitle>
            <AlertDialogDescription>
              {wouldDropBelowFive ? (
                <>
                  <span className="font-semibold text-destructive">
                    Warning:
                  </span>{" "}
                  Deleting this score will drop you below 5 scores and remove
                  you from the monthly draw until you add another score.
                </>
              ) : (
                "This may affect your draw eligibility if you drop below 5 scores."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
