import type { SyntheticEvent } from "react"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
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
import { setupCopy } from "@/lib/copy"

type SetupAvatarCropDialogProps = {
  open: boolean
  imagePreview: string | null
  crop: Crop
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onCropChange: (crop: Crop) => void
  onCropComplete: (crop: PixelCrop) => void
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void
  onCancel: () => void
  onSave: () => void
}

export function SetupAvatarCropDialog({
  open,
  imagePreview,
  crop,
  isSaving,
  onOpenChange,
  onCropChange,
  onCropComplete,
  onImageLoad,
  onCancel,
  onSave,
}: SetupAvatarCropDialogProps) {
  return (
    <Dialog
      open={open && Boolean(imagePreview)}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (!nextOpen) {
          onCancel()
        }
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] max-w-3xl border-border/70 bg-[rgba(24,24,24,0.98)] text-white shadow-2xl shadow-black/60">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl text-white">{setupCopy.avatar.cropTitle}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {setupCopy.avatar.cropDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="relative flex h-105 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
            <ReactCrop
              crop={crop}
              aspect={1}
              minWidth={96}
              minHeight={96}
              keepSelection
              ruleOfThirds
              onChange={(_, percentageCrop) => onCropChange(percentageCrop)}
              onComplete={(pixelCrop) => onCropComplete(pixelCrop)}
              className="max-h-full max-w-full"
            >
              <img
                alt="Avatar crop"
                src={imagePreview ?? undefined}
                onLoad={onImageLoad}
                className="select-none"
                style={{
                  maxHeight: 420,
                  maxWidth: "100%",
                  width: "auto",
                  height: "auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />
            </ReactCrop>
          </div>

          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              data-testid="crop-cancel-btn"
              variant="outline"
              className="border-white/10 bg-transparent text-white hover:bg-white/10 hover:text-white"
              onClick={onCancel}
            >
              {setupCopy.avatar.cancel}
            </Button>
            <Button
              type="button"
              data-testid="crop-save-btn"
              className="bg-white text-black hover:bg-zinc-200"
              onClick={onSave}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : null}
              {setupCopy.avatar.save}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
