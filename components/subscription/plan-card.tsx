import React from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

interface PlanCardProps {
  plan: "monthly" | "yearly"
  price: string
  isCurrentPlan: boolean
  onSelect: () => void
  disabled?: boolean
  savings?: string
}

const features = {
  monthly: ["Standard support", "Basic analytics", "Access to all charities"],
  yearly: [
    "Priority support",
    "Advanced analytics",
    "Access to all charities",
    "Early access to new features",
    "No transaction fees",
  ],
}

export function PlanCard({
  plan,
  price,
  isCurrentPlan,
  onSelect,
  disabled,
  savings,
}: PlanCardProps) {
  return (
    <Card
      className={`flex flex-col transition-all duration-300 ${
        isCurrentPlan
          ? "scale-102 border-2 border-primary shadow-lg"
          : "border-border/50 hover:border-primary/50"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold capitalize">{plan}</CardTitle>
          {savings && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {savings}
            </Badge>
          )}
        </div>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight">
            {price}
          </span>
          <span className="ml-1 text-sm font-medium text-muted-foreground">
            /{plan === "monthly" ? "mo" : "yr"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <ul className="space-y-3">
          {features[plan].map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Button
          className="w-full font-semibold"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={disabled || isCurrentPlan}
          onClick={onSelect}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  )
}
