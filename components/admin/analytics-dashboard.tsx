"use client"

import { useMemo, useState, useEffect } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format, subDays, eachDayOfInterval, parseISO } from "date-fns"
import { Trophy } from "lucide-react"

interface AnalyticsDashboardProps {
  users: Array<{ created_at: string; subscription_status: string }>
  draws: Array<{
    id: string
    draw_month: string
    jackpot_amount: number
    tier_4_amount: number
    tier_3_amount: number
    total_subscribers: number
    status: string
  }>
  contributions: Array<{ amount: number; created_at: string }>
  winners: Array<{ prize_amount: number; created_at: string; tier: string }>
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AnalyticsDashboard({ users, draws, contributions, winners }: AnalyticsDashboardProps) {
  // User growth over time (last 30 days)
  const userGrowthData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    })

    return days.map((day) => {
      const dayStr = format(day, "yyyy-MM-dd")
      const count = users.filter((u) => {
        const createdDate = parseISO(u.created_at)
        return format(createdDate, "yyyy-MM-dd") === dayStr
      }).length

      return {
        date: format(day, "MMM dd"),
        newUsers: count,
        totalUsers: users.filter((u) => parseISO(u.created_at) <= day).length,
      }
    })
  }, [users])

  // Draw prize pools
  const drawData = useMemo(() => {
    return draws.slice(0, 6).map((draw) => ({
      month: format(parseISO(draw.draw_month), "MMM yyyy"),
      jackpot: Number(draw.jackpot_amount) || 0,
      tier4: Number(draw.tier_4_amount) || 0,
      tier3: Number(draw.tier_3_amount) || 0,
      total: Number(draw.jackpot_amount) + Number(draw.tier_4_amount) + Number(draw.tier_3_amount),
    }))
  }, [draws])

  // Charity contributions by month
  const charityData = useMemo(() => {
    const monthlyContributions: Record<string, number> = {}

    contributions.forEach((c) => {
      const month = format(parseISO(c.created_at), "MMM yyyy")
      monthlyContributions[month] = (monthlyContributions[month] || 0) + Number(c.amount)
    })

    return Object.entries(monthlyContributions)
      .map(([month, amount]) => ({ month, amount }))
      .slice(-6)
  }, [contributions])

  // Winner tiers distribution
  const winnerTierData = useMemo(() => {
    const tiers: Record<string, number> = { jackpot: 0, tier_4: 0, tier_3: 0 }
    const amounts: Record<string, number> = { jackpot: 0, tier_4: 0, tier_3: 0 }

    winners.forEach((w) => {
      tiers[w.tier] = (tiers[w.tier] || 0) + 1
      amounts[w.tier] = (amounts[w.tier] || 0) + Number(w.prize_amount)
    })

    return [
      { name: "Jackpot", value: tiers.jackpot || 0, amount: amounts.jackpot || 0 },
      { name: "4-Match", value: tiers.tier_4 || 0, amount: amounts.tier_4 || 0 },
      { name: "3-Match", value: tiers.tier_3 || 0, amount: amounts.tier_3 || 0 },
    ]
  }, [winners])

  // Subscription status pie chart
  const subscriptionData = useMemo(() => {
    const statusCounts: Record<string, number> = {}
    users.forEach((u) => {
      const status = u.subscription_status || "inactive"
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  }, [users])

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>User Growth (Last 30 Days)</CardTitle>
            <CardDescription>New user signups and total user count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 flex items-center justify-center">
              <p className="text-muted-foreground">Loading charts...</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-6">
                <div className="h-62.5 flex items-center justify-center">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Growth Chart */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>User Growth (Last 30 Days)</CardTitle>
          <CardDescription>New user signups and total user count over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981" }}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Prize Pool Distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Prize Pools by Draw</CardTitle>
            <CardDescription>Recent draw prize distributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drawData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `£${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="jackpot" stackId="a" fill="#f59e0b" name="Jackpot" />
                  <Bar dataKey="tier4" stackId="a" fill="#3b82f6" name="4-Match" />
                  <Bar dataKey="tier3" stackId="a" fill="#10b981" name="3-Match" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Charity Contributions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Charity Contributions</CardTitle>
            <CardDescription>Monthly donation totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `£${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#ef4444" name="Contributions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Winner Tiers */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Winner Distribution</CardTitle>
            <CardDescription>Winners by prize tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              {
                winnerTierData.every((tier) => tier.value === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <Trophy className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No winners yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={winnerTierData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {winnerTierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )
              }
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {winnerTierData.map((tier, index) => (
                <div key={tier.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {tier.name}: {tier.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>User subscription distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
