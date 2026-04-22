import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { PageHeader } from "@/components/layout/page-header"
import { ProfileEditForm } from "@/components/profile/profile-edit-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const fullName: string = profile?.full_name || ""
  const [firstName = "", ...rest] = fullName.trim().split(" ")
  const lastName = rest.join(" ")
  const email = profile?.email || user.email || ""
  const initials = fullName
    ? fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : (email?.[0] || "U").toUpperCase()

  const isSubscribed = profile?.subscription_status === "active"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="space-y-1.5 text-center">
          <AvatarUpload
            avatarUrl={profile?.avatar_url}
            fullName={fullName}
            initials={initials}
            userId={user.id}
          />
          <p className="text-[10px] text-muted-foreground">Click to change</p>
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold">{fullName || "Your Name"}</p>
            <Badge
              variant={isSubscribed ? "default" : "outline"}
              className={isSubscribed ? "bg-primary/10 text-primary border-primary/30" : "text-muted-foreground"}
            >
              {isSubscribed ? "Active Member" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <ProfileEditForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        subscriptionPlan={profile?.subscription_plan}
        subscriptionStatus={profile?.subscription_status}
      />
    </div>
  )
}
