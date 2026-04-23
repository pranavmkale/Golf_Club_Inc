"use server"

import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { sendEmail } from "@/lib/email/client"
import { welcomeEmail } from "@/lib/email/templates/welcome"
import { getSiteUrl } from "@/lib/site-url"

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // If the account exists but email isn't confirmed, auto-confirm it (dev mode)
    if (error.message === "Email not confirmed") {
      // Look up the user by email via admin client and confirm them
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers()
      const user = userList?.users?.find((u) => u.email === email)

      if (user) {
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          email_confirm: true,
        })

        // Retry sign-in now that email is confirmed
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!retryError) redirect("/dashboard")
        return { error: "Wrong password. Please try again." }
      }
    }

    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function signUp(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const supabase = await createClient()

  // 1. Sign up the user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  if (data.user) {
    sendEmail(email, "Welcome to Golf Club Inc. 🎉", welcomeEmail(fullName))
  }

  redirect("/dashboard")
}

export async function forgotPassword(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address" }
  }

  const supabase = await createClient()
  const siteUrl = getSiteUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error("Supabase error:", error)
    return { error: error.message }
  }

  return { success: `Password reset link sent to ${email}` }
}

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Password updated successfully" }
}
