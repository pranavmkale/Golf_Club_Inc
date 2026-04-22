"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TopBarProps {
  profile: any
}

export function TopBar({ profile }: TopBarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const isSubscribed = profile?.subscription_status === "active"

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Logo / Title for mobile */}
        <div className="md:hidden">
          <span className="text-lg font-black tracking-tighter luma-gradient-text uppercase">
            Golf Draw
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Subscription Status */}
        <Badge
          variant={isSubscribed ? "default" : "outline"}
          className={isSubscribed ? "bg-primary/20 text-primary border-primary/30" : "text-muted-foreground"}
        >
          {isSubscribed ? "Active Member" : "Needs Subscription"}
        </Badge>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary uppercase">
                  {profile?.full_name?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
