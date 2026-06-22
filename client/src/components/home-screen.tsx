import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Home, Settings2, Shield, Clock3 } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { homeCopy } from "@/lib/copy"
import type { Organization } from "@/lib/types"
import { useAuthStore } from "@/stores/auth-store"
import { AppShell, type NavItem } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { HomeEmptyState } from "@/components/home/home-empty-state"
import { HomeOrganizationCard } from "@/components/home/home-organization-card"
import { HomeCreateCard } from "@/components/home/home-create-card"
import { HomeCreateDialog } from "@/components/home/home-create-dialog"

export function HomeScreen() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const [createOpen, setCreateOpen] = useState(false)
  const [organizationName, setOrganizationName] = useState("")

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Home", href: "/home", icon: Home, active: true },
      { label: "Profile", href: "/dashboard/onboarding?redirectTo=%2Fdashboard", icon: Settings2 },
      { label: "Security", href: "/home", icon: Shield },
      { label: "Sessions", href: "/home", icon: Clock3 },
    ],
    [],
  )

  const { data, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const response = await api.get<Organization[]>("/organizations")
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post<Organization>("/organizations", { name: organizationName })
      return response.data
    },
    onSuccess: async () => {
      setOrganizationName("")
      setCreateOpen(false)
      await queryClient.invalidateQueries({ queryKey: ["organizations"] })
    },
    onError: (error) => {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not create organization"
      toast.error(message)
    },
  })

  return (
    <AppShell
      brand="Personal"
      title="Home"
      breadcrumbs={[{ label: "Home" }]}
      navItems={navItems}
      user={user!}
      onLogout={() => {
        signOut()
        navigate("/signin", { replace: true })
      }}
      topRight={
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full md:hidden"
            data-testid="home-create-mobile-btn"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      }
      >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{homeCopy.title}</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="aspect-video rounded-lg" />
          </div>
        ) : (data?.length ?? 0) === 0 ? (
          <HomeEmptyState onCreate={() => setCreateOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data?.map((organization) => <HomeOrganizationCard key={organization.id} organization={organization} />)}
            <HomeCreateCard onCreate={() => setCreateOpen(true)} />
          </div>
        )}
      </div>

      <HomeCreateDialog
        open={createOpen}
        organizationName={organizationName}
        isSubmitting={createMutation.isPending}
        onOpenChange={setCreateOpen}
        onOrganizationNameChange={setOrganizationName}
        onSubmit={() => createMutation.mutate()}
      />
    </AppShell>
  )
}
