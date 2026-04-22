/**
 * lib/errors/messages.ts
 * Centralized mapping of technical error codes to user-friendly messages.
 */

const ERROR_MAP: Record<string, string> = {
  // Supabase/Postgres Codes
  "23505": "This record already exists. Please try a different value.",
  "PGRST116": "We couldn't find the requested information.",
  "42P01": "There was a configuration error in our database connection.",
  
  // Auth Errors
  "invalid_credentials": "The email or password you entered is incorrect.",
  "user_already_exists": "An account with this email address already exists.",
  "email_not_confirmed": "Please verify your email address before signing in.",
  
  // Stripe Errors
  "card_declined": "Your card was declined. Please check your payment details.",
  "expired_card": "The card has expired. Please use a different card.",
  "incorrect_cvc": "The card's security code is incorrect.",
  
  // Custom Platform Errors
  "INSUFFICIENT_SCORES": "You need exactly 5 scores to enter a draw.",
  "UNAUTHORIZED": "You don't have permission to perform this action.",
}

const DEFAULT_MESSAGE = "Something went wrong on our end. Please try again in a few moments."

/**
 * getFriendlyError - Sanitizes technical errors for the end-user.
 */
export function getFriendlyError(error: any): string {
  if (!error) return DEFAULT_MESSAGE

  // Check for specialized error objects or raw strings
  const code = error.code || error.message || error

  if (typeof code === "string" && ERROR_MAP[code]) {
    return ERROR_MAP[code]
  }

  // Fallback to searching message content
  const message = (error.message || "").toLowerCase()
  if (message.includes("unique constraint") || message.includes("already exists")) {
    return ERROR_MAP["23505"]
  }

  return DEFAULT_MESSAGE
}
