"use server"

import { supabaseAdmin } from "@/lib/supabase/admin"
import { PageHeader } from "@/components/layout/page-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Users,
  Trophy,
  Heart,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { ExportSection } from "@/components/admin/export-section"

export default async function AdminReportsPage() {
  // Fetch all required data for reports
  const [usersRes, drawsRes, winnersRes, charityRes, contributionsRes] =
    await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("created_at, subscription_status, subscription_plan"),
      supabaseAdmin
        .from("draws")
        .select("*, draw_entries(count)")
        .order("draw_month", { ascending: false }),
      supabaseAdmin
        .from("winners")
        .select("*, draw:draws(draw_month), profile:profiles(full_name, email)")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("charities")
        .select("*, charity_contributions(amount)"),
      supabaseAdmin
        .from("charity_contributions")
        .select("amount, created_at")
        .order("created_at", { ascending: true }),
    ])

  const users = (usersRes.data || []) as Array<{
    created_at: string
    subscription_status: string
    subscription_plan?: string
  }>
  const draws = (drawsRes.data || []) as any[]
  const winners = (winnersRes.data || []) as Array<{
    prize_amount: number
    created_at: string
    tier: string
  }>
  const charities = (charityRes.data || []) as any[]
  const contributions = (contributionsRes.data || []) as Array<{
    amount: number
    created_at: string
  }>

  // Calculate stats
  const totalUsers = users.length
  const activeSubscribers = users.filter(
    (u) => u.subscription_status === "active"
  ).length
  const totalDraws = draws.length
  const totalWinners = winners.length
  const totalPrizeMoney = winners.reduce(
    (sum, w) => sum + Number(w.prize_amount || 0),
    0
  )
  const totalCharity = contributions.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  )

  // Monthly revenue calculation
  const monthlyRevenue = activeSubscribers * 9.99 // Assuming monthly plan price
  const yearlyRevenue =
    users.filter((u) => u.subscription_plan === "yearly").length * (99.99 / 12)
  const estimatedMonthlyRevenue = monthlyRevenue + yearlyRevenue

  const reportCards = [
    {
      title: "User Growth Report",
      description: `Total users: ${totalUsers} | Active: ${activeSubscribers}`,
      icon: Users,
      href: "/admin/reports/users",
      color: "text-blue-500",
      stats: `${((activeSubscribers / totalUsers) * 100).toFixed(1)}% active`,
    },
    {
      title: "Draw Statistics",
      description: `${totalDraws} draws completed | ${totalWinners} winners`,
      icon: Trophy,
      href: "/admin/reports/draws",
      color: "text-amber-500",
      stats: `£${totalPrizeMoney.toLocaleString()} awarded`,
    },
    {
      title: "Charity Impact Report",
      description: `${charities.length} charities supported`,
      icon: Heart,
      href: "/admin/reports/charity",
      color: "text-rose-500",
      stats: `£${totalCharity.toLocaleString()} raised`,
    },
    {
      title: "Revenue Analytics",
      description: "Subscription revenue and trends",
      icon: TrendingUp,
      href: "/admin/reports/revenue",
      color: "text-green-500",
      stats: `£${estimatedMonthlyRevenue.toFixed(0)}/mo est.`,
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive platform analytics and downloadable reports."
      />

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            color: "bg-blue-500/10 text-blue-500",
          },
          {
            label: "Active Subs",
            value: activeSubscribers,
            icon: TrendingUp,
            color: "bg-green-500/10 text-green-500",
          },
          {
            label: "Total Draws",
            value: totalDraws,
            icon: Calendar,
            color: "bg-amber-500/10 text-amber-500",
          },
          {
            label: "Charity Raised",
            value: `£${totalCharity.toLocaleString()}`,
            icon: Heart,
            color: "bg-rose-500/10 text-rose-500",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportCards.map((report) => (
          <Card
            key={report.title}
            className="border-border/50 transition-colors hover:border-primary/50"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`bg-opacity-10 rounded-lg p-2 ${report.color.replace("text-", "bg-")} ${report.color}`}
                  >
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${report.color}`}>
                  {report.stats}
                </p>
                <Link href={report.href}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export Section */}
      <ExportSection />
    </div>
  )
}
