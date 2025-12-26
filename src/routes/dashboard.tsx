import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { signOut, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
  getCentersForUser,
  getCurrentUserRole,
} from "@/core/functions/center-functions"
import {
  getAllCenters,
  createInvitation,
} from "@/core/functions/invitation-functions"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Building2, UserPlus, Search, LogOut } from "lucide-react"

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  const navigate = useNavigate()
  const { data: session, isPending: sessionPending } = useSession()
  const [activeTab, setActiveTab] = useState<"centers" | "invitations">("centers")
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteSearchQuery, setInviteSearchQuery] = useState("")
  const [selectedCenters, setSelectedCenters] = useState<string[]>([])
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)

  const { data: userRole } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: () => getCurrentUserRole(),
    enabled: !!session,
  })

  const { data: allCenters, isLoading: allCentersLoading } = useQuery({
    queryKey: ["allCenters"],
    queryFn: () => getAllCenters(),
    enabled: userRole?.role === "superadmin",
  })

  const { data: centers, isLoading: centersLoading } = useQuery({
    queryKey: ["centers"],
    queryFn: () => getCentersForUser(),
    enabled: !!session,
  })

  const createInvitationMutation = useMutation({
    mutationFn: (centerIds: string[]) =>
      createInvitation({ data: { centerIds, expiresInDays: 7 } }),
    onSuccess: (data) => {
      const link = `${window.location.origin}/auth/sign-up?invite=${data.token}`
      setGeneratedLink(link)
      toast.success("Invitation link generated successfully")
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate invitation")
    },
  })

  const handleGenerateLink = () => {
    if (selectedCenters.length === 0) {
      toast.error("Please select at least one center")
      return
    }
    createInvitationMutation.mutate(selectedCenters)
  }

  const handleCopyLink = async () => {
    if (!generatedLink) return
    await navigator.clipboard.writeText(generatedLink)
    toast.success("Link copied to clipboard")
  }

  const toggleCenter = (centerId: string) => {
    setSelectedCenters((prev) =>
      prev.includes(centerId)
        ? prev.filter((id) => id !== centerId)
        : [...prev, centerId]
    )
    setGeneratedLink(null)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: "/auth/sign-in" })
  }

  const filteredCenters = centers?.filter((center) =>
    center.dialysisCenterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.town?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (sessionPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!session) {
    navigate({ to: "/auth/sign-in" })
    return null
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader>
          <h2 className="px-2 text-lg font-semibold">Menu</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "centers"}
                  onClick={() => setActiveTab("centers")}
                >
                  <Building2 />
                  <span>Dialysis Centers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {userRole?.role === "superadmin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === "invitations"}
                    onClick={() => setActiveTab("invitations")}
                  >
                    <UserPlus />
                    <span>Invitations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut}>
                <LogOut />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {activeTab === "centers" ? "Dialysis Centers" : "Generate Invitations"}
            </h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                You are signed in as {session.user?.name} ({session.user?.email})
              </CardDescription>
            </CardHeader>
          </Card>

          {activeTab === "centers" ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search centers by name, town, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {centersLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-5 w-3/4 rounded bg-muted" />
                        <div className="h-4 w-1/2 rounded bg-muted" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 w-full rounded bg-muted" />
                          <div className="h-4 w-2/3 rounded bg-muted" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !filteredCenters.length ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No centers match your search."
                        : "No dialysis centers assigned to you yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCenters.map((center) => (
                    <Link
                      key={center.id}
                      to="/centers/$centerId"
                      params={{ centerId: center.id }}
                      className="block transition-transform hover:scale-[1.02]"
                    >
                      <Card className="h-full cursor-pointer transition-shadow hover:ring-2 hover:ring-primary/20">
                        <CardHeader>
                          <CardTitle className="line-clamp-1">
                            {center.dialysisCenterName}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                              {center.sector}
                            </span>
                            {center.state?.name && (
                              <span className="text-xs">{center.state.name}</span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="line-clamp-1">{center.town}</p>
                            <p className="line-clamp-2">{center.address}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Generate PIC Invitation
                  {selectedCenters.length > 0 && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {selectedCenters.length} selected
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Select centers to assign to the new PIC user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search centers..."
                    value={inviteSearchQuery}
                    onChange={(e) => setInviteSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {allCentersLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-full animate-pulse rounded bg-muted"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {allCenters
                      ?.filter(
                        (center) =>
                          center.dialysisCenterName
                            .toLowerCase()
                            .includes(inviteSearchQuery.toLowerCase()) ||
                          center.town
                            ?.toLowerCase()
                            .includes(inviteSearchQuery.toLowerCase()) ||
                          center.stateName
                            ?.toLowerCase()
                            .includes(inviteSearchQuery.toLowerCase())
                      )
                      .map((center) => (
                        <div key={center.id} className="flex items-center gap-3">
                          <Checkbox
                            id={center.id}
                            checked={selectedCenters.includes(center.id)}
                            onCheckedChange={() => toggleCenter(center.id)}
                          />
                          <Label
                            htmlFor={center.id}
                            className="cursor-pointer text-sm"
                          >
                            {center.dialysisCenterName}
                            {center.stateName && (
                              <span className="ml-2 text-muted-foreground">
                                ({center.stateName})
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateLink}
                    disabled={
                      selectedCenters.length === 0 ||
                      createInvitationMutation.isPending
                    }
                  >
                    {createInvitationMutation.isPending
                      ? "Generating..."
                      : "Generate Link"}
                  </Button>
                </div>

                {generatedLink && (
                  <div className="space-y-2">
                    <Label>Invitation Link</Label>
                    <div className="flex gap-2">
                      <Input value={generatedLink} readOnly className="flex-1" />
                      <Button variant="outline" onClick={handleCopyLink}>
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
