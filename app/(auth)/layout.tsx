import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border bg-card shadow-2xl transition-all hover:shadow-[0_0_20px_rgba(var(--color-primary),0.1)]">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="luma-gradient-text text-3xl font-extrabold tracking-tight">
              Golf & Charity
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Support causes while you play
            </p>
          </CardHeader>
          <CardContent className="pt-2">{children}</CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Golf. All rights reserved.
        </p>
      </div>
    </div>
  )
}
