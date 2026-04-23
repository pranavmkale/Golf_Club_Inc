import { Loader } from "lucide-react"

export default function AppLoader() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center space-y-2">
      <Loader className="mx-auto h-8 w-8 animate-spin text-primary" />
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">Loading...</p>
      </div>
    </main>
  )
}
