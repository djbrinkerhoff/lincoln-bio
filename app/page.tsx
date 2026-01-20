import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Lincoln Bio</h1>
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your one link for everything
          </h2>
          <p className="text-xl text-muted-foreground">
            Create a beautiful link-in-bio page in minutes. Share all your important links in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get started free</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 max-w-md mx-auto">
          <div className="border rounded-lg p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Your Name</h3>
              <p className="text-sm text-muted-foreground">Your bio goes here</p>
            </div>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border text-center">My Website</div>
              <div className="p-4 rounded-lg border text-center">Twitter</div>
              <div className="p-4 rounded-lg border text-center">YouTube</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Lincoln Bio - Simple link-in-bio pages</p>
        </div>
      </footer>
    </div>
  )
}
