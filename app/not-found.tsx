import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-10 w-10 animate-pulse text-primary" />
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-tight uppercase">
          Are you lost?
        </h1>
        <p className="mb-12 text-muted-foreground">
          We couldn't find the page you're looking for. It might have been
          moved, or perhaps it never existed in this dimension.
        </p>

        <Link href="/" className="w-full sm:w-auto">
          <Button className="h-14 gap-2 px-12 text-sm font-bold tracking-widest uppercase">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
