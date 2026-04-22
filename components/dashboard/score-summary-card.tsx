"use client"

import { Plus, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScoreCard } from "@/components/scores/score-card"
import { ScoreList } from "@/components/scores/score-list"
import { ScoreEntryDialog } from "@/components/scores/score-entry-dialog"
import { Score } from "@/lib/types/database"

interface ScoreSummaryCardProps {
  scores: Score[]
}

export function ScoreSummaryCard({ scores }: ScoreSummaryCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Performance History</h2>
        </div>
        <ScoreEntryDialog
          trigger={
            <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Add Score
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ScoreCard scores={scores} />
        </div>
        
        <div className="lg:col-span-3">
          <ScoreList scores={scores} />
        </div>
      </div>
    </div>
  )
}
