"use client"

import { useActionState } from "react"
import Link from "next/link"
import { forgotPassword } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state?.success && (
        <Alert className="border-primary/50 bg-primary/10 text-primary">
          <AlertDescription>{state.success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to Sign In
        </Link>
      </div>
    </form>
  )
}
