import { Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Organization } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { homeCopy } from "@/lib/copy"

type HomeOrganizationCardProps = {
  organization: Organization
}

export function HomeOrganizationCard({ organization }: HomeOrganizationCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      aria-label={`Open organization ${organization.name}`}
      data-testid={`organization-card-${organization.id}`}
      className="flex h-39 cursor-pointer flex-col justify-between border-border/60 bg-card/50 transition-all hover:border-border/40 hover:bg-card/70 hover:shadow-sm"
      onClick={() => navigate(`/dashboard/${organization.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          navigate(`/dashboard/${organization.id}`)
        }
      }}
    >
      <CardHeader className="px-4 pb-1 pt-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-semibold text-foreground">
            {organization.name.slice(0, 1).toUpperCase()}
          </div>
          <CardTitle className="truncate text-sm font-semibold">{organization.name}</CardTitle>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between border-t border-border/40 px-4 py-2.5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>
            {organization.memberCount} member
            {organization.memberCount > 1 ? "s" : ""}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          data-testid={`open-organization-btn-${organization.id}`}
          className="h-7 border-border/60 px-2.5 text-xs hover:border-border/40 hover:bg-white hover:text-black"
          onClick={(event) => {
            event.stopPropagation()
            navigate(`/dashboard/${organization.id}`)
          }}
        >
          {homeCopy.actions.open}
        </Button>
      </CardFooter>
    </Card>
  )
}
