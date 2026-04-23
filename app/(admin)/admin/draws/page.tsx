import { supabaseAdmin } from "@/lib/supabase/admin"
import type { Draw } from "@/lib/types/database"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { InitializeDrawDialog } from "@/components/admin/initialize-draw-dialog"
import { DrawActions } from "@/components/admin/draw-actions"


export default async function AdminDrawsPage() {

  const { data: drawsData, error } = await supabaseAdmin
    .from("draws")
    .select("*")
    .order("draw_month", { ascending: false })

  if (error) throw error
  const draws = (drawsData || []) as Draw[]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Draw Management"
        description="Execute and monitor monthly lottery events."
      >
        <InitializeDrawDialog />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Draw Stats Cards */}
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Draws</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{draws.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Last Jackpot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">
              £{Number(draws[0]?.jackpot_amount || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Rollovers Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">
              {draws.filter((d) => d.jackpot_rolled_over).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/20">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Winning Numbers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total Pool</TableHead>
              <TableHead className="w-25"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draws.map((draw) => {
              const totalPool =
                Number(draw.jackpot_amount) +
                Number(draw.tier_4_amount) +
                Number(draw.tier_3_amount)
              return (
                <TableRow
                  key={draw.id}
                  className="group transition-colors hover:bg-card/40"
                >
                  <TableCell className="font-bold tracking-tight uppercase">
                    {format(new Date(draw.draw_month), "MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {draw.draw_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(draw.winning_numbers || []).map((num: number) => (
                        <span
                          key={num}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[10px] font-black text-primary"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          draw.status === "published"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        )}
                      />
                      <span className="text-xs font-semibold uppercase">
                        {draw.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-black">
                    £{totalPool.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DrawActions drawId={draw.id} drawStatus={draw.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-center text-[10px] text-muted-foreground italic">
        Simulation and Publishing workflow uses the /api/admin/draws endpoints.
      </p>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
