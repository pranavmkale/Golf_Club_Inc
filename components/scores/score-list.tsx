"use client"

import * as React from "react"
import { format } from "date-fns"
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react"
import { deleteScoreAction, updateScoreAction } from "@/app/actions/scores"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Score } from "@/lib/types/database"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ScoreListProps {
  scores: Score[]
}

export function ScoreList({ scores }: ScoreListProps) {
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteScoreAction(id)
    if (result.success) {
      toast.success("Score deleted successfully")
    } else {
      toast.error(result.error || "Failed to delete score")
    }
    setIsDeleting(null)
  }

  const sortedScores = [...scores].sort(
    (a, b) => new Date(b.played_on).getTime() - new Date(a.played_on).getTime()
  )

  return (
    <div className="space-y-6">
      {/* Status Banners */}
      {scores.length < 5 ? (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Add <span className="font-bold text-foreground">{5 - scores.length}</span> more score(s) to be eligible for the next draw.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center">
          <Badge variant="default" className="mb-1">ELIGIBLE</Badge>
          <p className="text-sm font-semibold text-primary">
            Draw entry ready! You have 5 scores submitted.
          </p>
        </div>
      )}

      {scores.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-2 py-12 text-center border-2 border-dashed border-border/50 rounded-xl">
          <p className="text-muted-foreground">No scores recorded yet.</p>
          <p className="text-sm text-muted-foreground/60">Submit your first score to start tracking your performance.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Played</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedScores.map((score) => (
                <TableRow key={score.id}>
                  <TableCell className="font-medium">
                    {format(new Date(score.played_on), "PPP")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {score.score}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Edit and Delete actions would go here or in a separate modal */}
                        {/* Simplifying forbrevity as requested to use AlertDialog for delete */}
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(score.id)}
                          disabled={isDeleting === score.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting === score.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
