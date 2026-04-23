"use client"

import { useTransition } from "react"
import { createPortalAction } from "@/app/actions/stripe"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, ExternalLink, Loader2 } from "lucide-react"

interface SubscriptionStatusCardProps {
  status: string
  plan: string | null
}

export function SubscriptionStatusCard({
  status,
  plan,
}: SubscriptionStatusCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleManageBilling = () => {
    startTransition(async () => {
      try {
        await createPortalAction()
      } catch (error) {
        console.error("Portal error", error)
      }
    })
  }

  const isActive = status === "active"

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Subscription</CardTitle>
          <CardDescription>Manage your plan and billing</CardDescription>
        </div>
        <CreditCard className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Status
            </span>
            <Badge
              variant={isActive ? "default" : "destructive"}
              className={
                isActive ? "border-primary/30 bg-primary/20 text-primary" : ""
              }
            >
              {isActive ? "Active" : status.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Current Plan
            </span>
            <span className="text-sm font-bold capitalize">
              {plan || "No Active Plan"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleManageBilling}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Billing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
