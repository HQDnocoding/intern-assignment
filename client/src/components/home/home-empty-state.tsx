import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { homeCopy } from "@/lib/copy"

type HomeEmptyStateProps = {
  onCreate: () => void
}

export function HomeEmptyState({ onCreate }: HomeEmptyStateProps) {
  return (
    <div className="flex min-h-100 items-center justify-center rounded-lg border border-dashed border-border/50 bg-card/20 px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Plus className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{homeCopy.empty.title}</h2>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">{homeCopy.empty.description}</p>
        <Button
          className="mt-8 bg-white text-black hover:bg-zinc-200"
          data-testid="create-organization-empty-btn"
          onClick={onCreate}
        >
          {homeCopy.empty.action}
        </Button>
      </div>
    </div>
  )
}
