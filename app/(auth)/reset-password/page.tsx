"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2 } from "lucide-react"
import { updatePasswordAction } from "../actions"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(
    async (_: any, formData: FormData) => {
      const result = await updatePasswordAction(formData)
      if (result.success) {
        // Redirect after successful update
        setTimeout(() => router.push("/login"), 2000)
      }
      return result
    },
    null
  )

  const isSuccess = state?.success

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          {isSuccess
            ? "Your password has been reset successfully."
            : "Enter your new password below."}
        </p>
      </div>

      {state?.error && (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {isSuccess && (
        <Alert className="border-primary/50 bg-primary/10 text-primary">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          <AlertDescription>
            Password updated! Redirecting to login...
          </AlertDescription>
        </Alert>
      )}

      {!isSuccess && (
        <>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </>
      )}

      <div className="text-center text-sm">
        {isSuccess ? (
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Go to Sign In
          </Link>
        ) : (
          <>
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </form>
  )
}
