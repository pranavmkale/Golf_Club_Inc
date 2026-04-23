"use client"

import { useState, useMemo } from "react"
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
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"
import type { Profile } from "@/lib/types/database"

interface UsersTableProps {
  users: (Profile & { charities: { name: string } | null })[]
  scoreCounts: Record<string, number>
}

export function UsersTable({ users, scoreCounts }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [exporting, setExporting] = useState(false)

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.charities?.name?.toLowerCase().includes(query)
    )
  }, [users, searchQuery])

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const response = await fetch("/api/admin/export/users")
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `users-${format(new Date(), "yyyy-MM-dd")}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 bg-card/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleExportCSV} disabled={exporting}>
          {exporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </>
          )}
        </Button>
      </div>

      <div className="rounded-xl border border-border/50 bg-card/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Charity</TableHead>
              <TableHead className="text-center">Scores</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No users found matching &quot;{searchQuery}&quot;
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-card/40 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px] uppercase">
                          {user.full_name?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{user.full_name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge variant="destructive" className="text-[10px] uppercase">
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        Member
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit text-[10px] uppercase flex gap-1 items-center">
                        <div
                          className={`h-1 w-1 rounded-full ${
                            user.subscription_status === "active" ? "bg-green-500" : "bg-rose-500"
                          }`}
                        />
                        {user.subscription_status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {user.subscription_plan || "No Plan"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.charities?.name || (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {scoreCounts[user.id] || 0}/5
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {format(new Date(user.created_at), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        Showing {filteredUsers.length} of {users.length} users
      </p>
    </div>
  )
}
