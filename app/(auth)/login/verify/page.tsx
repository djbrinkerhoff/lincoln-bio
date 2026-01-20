import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click the link in your email to sign in. If you don&apos;t see it, check your spam folder.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            <strong>Development mode:</strong> Check your terminal for the magic link.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
