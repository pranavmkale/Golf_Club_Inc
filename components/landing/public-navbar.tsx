"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import Image from "next/image"
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

export function PublicNavbar() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState<{
    fullName: string
    email: string
    avatarUrl: string | null
  } | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const { data } = await supabase.auth.getUser()
      const currentUser = data.user

      if (!isMounted) return

      if (currentUser) {
        setUser({
          fullName:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.email ||
            "User",
          email: currentUser.email || "",
          avatarUrl: currentUser.user_metadata?.avatar_url || null,
        })
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }

    loadUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadUser()
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const avatarFallback = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex w-full justify-center px-4">
      <div className="flex w-full max-w-5xl items-center justify-between rounded-full border border-border/40 bg-background/80 px-4 py-2.5 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo.png"
            alt="Golf Club"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-sm font-black tracking-tight uppercase">
            Golf Club
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a
            href="#how-it-works"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <Link
            href="/charity"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Charities
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          {!isLoading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/40"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatarUrl || undefined}
                      alt={user.fullName}
                    />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary uppercase">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {user.fullName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden text-xs font-bold sm:inline-flex"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
