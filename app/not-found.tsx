import Link from "next/link"
import { Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-8">
          <Compass className="h-10 w-10 text-primary animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Are you lost?</h1>
        <p className="text-muted-foreground mb-12">
          We couldn't find the page you're looking for. It might have been moved, or perhaps it never existed in this dimension.
        </p>

        <Link href="/" className="w-full sm:w-auto">
          <Button className="h-14 px-12 text-sm font-bold uppercase tracking-widest gap-2">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
