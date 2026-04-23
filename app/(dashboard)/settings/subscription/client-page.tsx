"use client"

import { useState, useTransition } from "react"
import {
  createCheckoutAction,
  createPortalAction,
  cancelSubscriptionAction,
} from "@/app/actions/stripe"
import { PlanCard } from "@/components/subscription/plan-card"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"

interface SubscriptionClientProps {
  profile: any
  monthlyPrice: {
    id: string
    amount: string
  }
  yearlyPrice: {
    id: string
    amount: string
    savings?: string
  }
  subscriptionDetails?: {
    cancelAtPeriodEnd: boolean
    currentPeriodEnd: string
    status: string
  } | null
}

export function SubscriptionClient({
  profile,
  monthlyPrice,
  yearlyPrice,
  subscriptionDetails,
}: SubscriptionClientProps) {
  const [isPending, startTransition] = useTransition()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const onSelectPlan = (priceId: string) => {
    startTransition(async () => {
      try {
        await createCheckoutAction(priceId)
      } catch (error) {
        console.error("Checkout failed", error)
      }
    })
  }

  const onManageBilling = () => {
    startTransition(async () => {
      try {
        await createPortalAction()
      } catch (error) {
        console.error("Portal redirection failed", error)
      }
    })
  }

  const onCancelSubscription = () => {
    startTransition(async () => {
      try {
        const result = await cancelSubscriptionAction()
        if (result?.error) {
          toast.error("Error", { description: result.error })
        } else {
          toast.success("Subscription cancelled", {
            description:
              "Your subscription will remain active until the end of the current billing period.",
          })
          setShowCancelDialog(false)
        }
      } catch (error) {
        console.error("Cancel failed", error)
        toast.error("Error", {
          description: "Failed to cancel subscription. Please try again.",
        })
      }
    })
  }

  const isSubscribed = profile.subscription_status === "active"

  return (
    <div className="space-y-8">
      {isSubscribed && (
        <Card className="p-6 shadow-none">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">
                {subscriptionDetails?.cancelAtPeriodEnd ? (
                  <span className="text-amber-600 dark:text-amber-500">
                    Subscription Ending
                  </span>
                ) : (
                  "Active Subscription"
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                You are currently on the{" "}
                <span className="font-medium text-foreground capitalize">
                  {profile.subscription_plan}
                </span>{" "}
                plan.
                {subscriptionDetails?.cancelAtPeriodEnd && (
                  <span className="mt-1 block font-medium text-amber-600 dark:text-amber-500">
                    Access ends on{" "}
                    {new Date(
                      subscriptionDetails.currentPeriodEnd
                    ).toLocaleDateString("en-GB", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onManageBilling}
                disabled={isPending}
              >
                {isPending ? (
                  "Redirecting..."
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Billing
                  </>
                )}
              </Button>

              <Dialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Cancel Subscription?
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription?
                      You&apos;ll continue to have access until the end of your
                      current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="rounded-lg border bg-muted p-4">
                      <p className="text-sm font-medium">
                        What happens when you cancel:
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>
                          Access continues until the end of your billing period
                        </li>
                        <li>No partial refunds for unused time</li>
                        <li>You can resubscribe anytime</li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(false)}
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={onCancelSubscription}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Yes, Cancel"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <PlanCard
          plan="monthly"
          price={monthlyPrice.amount}
          isCurrentPlan={
            profile.subscription_plan === "monthly" && isSubscribed
          }
          onSelect={() => onSelectPlan(monthlyPrice.id)}
          disabled={isPending}
        />
        <PlanCard
          plan="yearly"
          price={yearlyPrice.amount}
          isCurrentPlan={profile.subscription_plan === "yearly" && isSubscribed}
          onSelect={() => onSelectPlan(yearlyPrice.id)}
          disabled={isPending}
          savings={yearlyPrice.savings}
        />
      </div>

      {!isSubscribed && (
        <p className="text-center text-sm text-muted-foreground">
          Secure payments powered by Stripe. You can cancel your subscription at
          any time.
        </p>
      )}
    </div>
  )
}
