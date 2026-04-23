import { supabaseAdmin } from "@/lib/supabase/admin"
import type { Charity } from "@/lib/types/database"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { CharityDialog } from "@/components/admin/charity-dialog"

export default async function AdminCharitiesPage() {
  const { data: charitiesData, error } = await supabaseAdmin
    .from("charities")
    .select("*")
    .order("name")

  if (error) throw error
  const charities = (charitiesData || []) as Charity[]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Charity Management"
        description="Manage causes and featured highlights."
      >
        <CharityDialog mode="add" />
      </PageHeader>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/20">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-25"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charities.map((charity) => (
              <TableRow
                key={charity.id}
                className="transition-colors hover:bg-card/40"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={charity.logo_url || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {charity.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{charity.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {charity.id.split("-")[0]}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {charity.description}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Badge
                      variant={charity.is_featured ? "default" : "outline"}
                      className="text-[10px] uppercase"
                    >
                      {charity.is_featured ? "Featured" : "—"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <Badge
                      variant={charity.is_active ? "default" : "secondary"}
                      className="text-[10px] uppercase"
                    >
                      {charity.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <CharityDialog
                      mode="edit"
                      charity={charity}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
