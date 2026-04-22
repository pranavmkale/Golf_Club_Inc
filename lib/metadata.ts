import type { Metadata } from "next"
import { getSiteUrl } from "@/lib/site-url"

const APP_NAME = "Golf Club Inc."
const APP_DESCRIPTION = "Support causes while you play. Join our golf community and make a difference with every game."
const APP_URL = getSiteUrl()

export const defaultMetadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["golf", "charity", "sports", "fundraising", "community", "draw", "winners"],
  authors: [{ name: "Golf Club Inc." }],
  creator: "Golf Club Inc.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: APP_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 1200,
        alt: "Golf Club Inc.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/Logo.png"],
  },
  icons: {
    icon: "/Logo.png",
    apple: "/Logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export function createMetadata(
  title: string,
  description?: string,
  options?: Partial<Metadata>
): Metadata {
  return {
    ...defaultMetadata,
    title: {
      default: title,
      template: `%s | ${APP_NAME}`,
    },
    description: description || APP_DESCRIPTION,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title,
      description: description || APP_DESCRIPTION,
      ...options?.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title,
      description: description || APP_DESCRIPTION,
      ...options?.twitter,
    },
    ...options,
  }
}
