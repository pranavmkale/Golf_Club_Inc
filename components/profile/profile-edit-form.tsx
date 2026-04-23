"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateProfileAction } from "@/app/actions/profile"
import { Loader2 } from "lucide-react"

interface ProfileEditFormProps {
  firstName: string
  lastName: string
  email: string
  subscriptionPlan?: string | null
  subscriptionStatus?: string | null
}

export function ProfileEditForm({
  firstName,
  lastName,
  email,
  subscriptionPlan,
  subscriptionStatus,
}: ProfileEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName,
    lastName,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const result = await updateProfileAction({ full_name: fullName })

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("Profile updated", {
        description: "Your changes have been saved.",
      })

      router.refresh()
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to update profile",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, firstName: e.target.value }))
            }
            placeholder="First name"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Last name"
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="Email address"
            disabled
            className="cursor-not-allowed opacity-60"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed here.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subscription">Subscription Plan</Label>
          <Input
            id="subscription"
            value={
              subscriptionPlan
                ? `${subscriptionPlan} — ${subscriptionStatus}`
                : "No active subscription"
            }
            disabled
            className="cursor-not-allowed opacity-60"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
