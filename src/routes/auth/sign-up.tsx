import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { signUp } from "@/lib/auth-client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getInvitationByToken,
  consumeInvitation,
} from "@/core/functions/invitation-functions"
import { z } from "zod"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const signUpSearchSchema = z.object({
  invite: z.string().optional(),
})

export const Route = createFileRoute("/auth/sign-up")({
  validateSearch: signUpSearchSchema,
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const { invite } = Route.useSearch()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: invitation,
    isLoading: invitationLoading,
    error: invitationError,
  } = useQuery({
    queryKey: ["invitation", invite],
    queryFn: () => getInvitationByToken({ data: { token: invite! } }),
    enabled: !!invite,
    retry: false,
  })

  const consumeInvitationMutation = useMutation({
    mutationFn: (userId: string) =>
      consumeInvitation({ data: { token: invite!, userId } }),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signUp.email({
      name,
      email,
      password,
    })

    if (result.error) {
      setError(result.error.message ?? "An error occurred")
      setIsLoading(false)
      return
    }

    if (invite && result.data?.user?.id) {
      try {
        await consumeInvitationMutation.mutateAsync(result.data.user.id)
        toast.success("Account created and centers assigned!")
      } catch {
        toast.error("Account created but failed to assign centers")
      }
    }

    navigate({ to: "/dashboard" })
  }

  if (invite && invitationLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Validating invitation...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (invite && invitationError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {invitationError instanceof Error
                  ? invitationError.message
                  : "This invitation link is invalid, expired, or has already been used."}
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">
              Please contact your administrator for a new invitation link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/auth/sign-in"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        {invitation && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assigned Centers</CardTitle>
              <CardDescription>
                After signing up, you will have access to these dialysis centers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {invitation.centers.map((center) => (
                  <li
                    key={center?.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    <span>{center?.dialysisCenterName}</span>
                    {center?.stateName && (
                      <span className="text-muted-foreground">
                        ({center.stateName})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {!invite && (
          <Alert>
            <AlertTitle>No Invitation</AlertTitle>
            <AlertDescription>
              You need an invitation link from an administrator to register.
              Contact your admin to get an invite.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
