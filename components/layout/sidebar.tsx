"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  Dices,
  Heart,
  Settings,
  Flag,
  LogOut,
  User,
  CreditCard,
  Bell,
  ChevronsUpDown,
  Star,
  Medal,
  Zap,
  CheckCircle2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

const navMain = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Scores",
    href: "/scores",
    icon: Star,
  },
  {
    title: "Draws",
    href: "/draws",
    icon: Dices,
  },
  {
    title: "Charity",
    href: "/charity",
    icon: Heart,
  },
  {
    title: "Winnings",
    href: "/winnings",
    icon: Medal,
  },
]

const navSecondary = [{ title: "Settings", href: "/settings", icon: Settings }]

// ─── NavUser (sidebar-08 pattern with useSidebar for mobile) ───────────────────
function NavUser({
  profile,
  onSignOut,
}: {
  profile: any
  onSignOut: () => void
}) {
  const { isMobile } = useSidebar()
  const isSubscribed = profile?.subscription_status === "active"
  const initials = profile?.full_name?.substring(0, 2)?.toUpperCase() || "GD"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={profile?.avatar_url}
                  alt={profile?.full_name}
                />
                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {profile?.full_name || "Member"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {profile?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile?.avatar_url}
                    alt={profile?.full_name}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile?.full_name}
                  </span>
                  <span className="truncate text-xs">{profile?.email}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    isSubscribed
                      ? "border-primary/30 bg-primary/10 text-[10px] text-primary"
                      : "text-[10px] text-muted-foreground"
                  }
                >
                  {isSubscribed ? "Active" : "Inactive"}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings/subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// ─── AppSidebar ─────────────────────────────────────────────────────────────
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  profile?: any
}

export function AppSidebar({ profile, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/Logo.png"
                  alt="Golf Draw"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Golf Club</span>
                  <span className="truncate text-xs">Monthly draws</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.title}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="mt-auto flex flex-col gap-2">
          <div className="px-3 group-data-[collapsible=icon]:hidden">
            {profile?.subscription_status === "active" ? (
              <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    Active Member
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  You&apos;re entered for this month&apos;s draw.
                </p>
              </div>
            ) : (
              <div className="space-y-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-destructive" />
                  <span className="text-xs font-semibold text-destructive">
                    No Subscription
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Subscribe to enter the monthly draw.
                </p>
                <Link
                  href="/settings/subscription"
                  className="block rounded-lg bg-primary px-3 py-1.5 text-center text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get Access
                </Link>
              </div>
            )}
          </div>

          {/* Account nav */}
          {/* <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup> */}
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser profile={profile} onSignOut={handleSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
