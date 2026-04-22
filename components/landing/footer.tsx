import { Link2, SparklesIcon } from "lucide-react"
import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="overflow-hidden border-t border-border/40 bg-background">
      <div className="container mx-auto flex flex-col items-center px-4 pt-16 pb-8 md:px-8">
        {/* Top Section */}
        <div className="flex flex-col items-center space-y-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="rounded-full bg-primary p-2">
              <SparklesIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold tracking-tight">Luma</span>
          </Link>
        </div>

        {/* Links & Copyright */}
        <div className="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Luma Template. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/PranavKale03"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/kale-pranav"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 11v5" />
                <path d="M8 8v.01" />
                <path d="M12 16v-5" />
                <path d="M16 16v-3a2 2 0 1 0 -4 0" />
                <path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
