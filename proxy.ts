import { type NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const { supabase, response, user } = await updateSession(request)

  const pathname = request.nextUrl.pathname

  // 1. Protect standard authenticated routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/api/protected")

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 2. Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check admin status from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // 3. Auth redirect (login/register -> dashboard)
  const isAuthPage = pathname === "/login" || pathname === "/register"
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets (svg, png, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
