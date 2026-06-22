import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { homeCopy } from "@/lib/copy"

type HomeCreateDialogProps = {
  open: boolean
  organizationName: string
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onOrganizationNameChange: (value: string) => void
  onSubmit: () => void
}

export function HomeCreateDialog({
  open,
  organizationName,
  isSubmitting,
  onOpenChange,
  onOrganizationNameChange,
  onSubmit,
}: HomeCreateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md border-border/60 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{homeCopy.createDialog.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {homeCopy.createDialog.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label htmlFor="organization-name" className="text-sm font-medium">
              {homeCopy.createDialog.label}
            </Label>
            <Input
              id="organization-name"
              value={organizationName}
              onChange={(event) => onOrganizationNameChange(event.target.value)}
              maxLength={50}
              className="border-border/50 bg-muted/30 focus:border-border/80 focus:bg-muted/50"
              placeholder={homeCopy.createDialog.placeholder}
              onKeyDown={(event) => {
                if (event.key === "Enter" && organizationName.trim()) {
                  onSubmit()
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{homeCopy.createDialog.helper}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            variant="outline"
            data-testid="create-modal-cancel-btn"
            onClick={() => onOpenChange(false)}
            className="border-border/50 hover:border-border/70 hover:bg-muted/30"
          >
            {homeCopy.createDialog.cancel}
          </Button>
          <Button
            className="bg-white text-black hover:bg-zinc-200"
            data-testid="create-modal-submit-btn"
            onClick={onSubmit}
            disabled={!organizationName.trim() || isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {homeCopy.createDialog.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
