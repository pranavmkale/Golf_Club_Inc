const DEFAULT_SITE_URL = "https://golf-club-inc.vercel.app"

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || DEFAULT_SITE_URL
}