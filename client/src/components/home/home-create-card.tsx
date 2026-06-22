import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { homeCopy } from "@/lib/copy"

type HomeCreateCardProps = {
  onCreate: () => void
}

export function HomeCreateCard({ onCreate }: HomeCreateCardProps) {
  return (
    <Card
      size="sm"
      role="button"
      tabIndex={0}
      aria-label="Create an organization"
      data-testid="create-organization-card"
      className="group flex h-39 cursor-pointer flex-col items-center justify-center border-border/60 border-dashed bg-card/50 transition-all hover:border-border/40 hover:bg-card/70 hover:shadow-sm"
      onClick={onCreate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onCreate()
        }
      }}
    >
      <CardContent className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition group-hover:scale-110 group-hover:bg-muted/80">
          <Plus className="h-4 w-4" />
        </div>
        <span className="text-center text-sm font-medium text-muted-foreground group-hover:text-foreground">
          {homeCopy.createCard.action}
        </span>
      </CardContent>
    </Card>
  )
}
