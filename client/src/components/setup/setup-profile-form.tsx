import { ArrowRight, ImagePlus, Loader2, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoMark } from "@/components/logo"
import { setupCopy } from "@/lib/copy"
import { cn } from "@/lib/utils"

type SetupProfileFormProps = {
  name: string
  avatarPreview: string | null
  initials: string
  isSubmitting: boolean
  onNameChange: (value: string) => void
  onPickAvatar: (file: File | null) => void
  onContinue: () => void
  onSignOut: () => void
  showSignOut: boolean
  userEmail?: string
}

export function SetupProfileForm({
  name,
  avatarPreview,
  initials,
  isSubmitting,
  onNameChange,
  onPickAvatar,
  onContinue,
  onSignOut,
  showSignOut,
  userEmail,
}: SetupProfileFormProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,#0a0a0a_0%,#101010_100%)]">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-white">Acme</span>
        </div>

        <Card className="w-full max-w-105 border-border/70 bg-[rgba(24,24,24,0.92)] text-white shadow-2xl shadow-black/30 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-5">
            <CardTitle className="text-[1.45rem] font-semibold tracking-tight text-white">
              {setupCopy.intro.title}
            </CardTitle>
            <CardDescription className="text-sm text-zinc-400">
              {setupCopy.intro.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                {setupCopy.name.label}
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => onNameChange(event.target.value)}
                  placeholder={setupCopy.name.placeholder}
                  className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:bg-white/7"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white">{setupCopy.avatar.label}</Label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className={cn(
                    "group relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 transition hover:border-white/20",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                  )}
                  onClick={() => document.getElementById("avatar-input")?.click()}
                >
                  <Avatar className="size-24">
                    <AvatarImage src={avatarPreview ?? undefined} alt={name || userEmail || "avatar"} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                    <ImagePlus className="size-5 text-white" />
                  </span>
                </button>

                <div className="space-y-1">
                  <div className="font-medium text-white">{setupCopy.avatar.headline}</div>
                  <p className="max-w-55 text-sm leading-5 text-zinc-400">
                    {setupCopy.avatar.description}
                  </p>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => onPickAvatar(event.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </div>

            <Button
              className="h-11 w-full bg-white text-black hover:bg-zinc-200"
              data-testid="continue-btn"
              onClick={onContinue}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {setupCopy.actions.continue}
              <ArrowRight className="size-4" />
            </Button>
            {showSignOut ? (
              <Button
                type="button"
                data-testid="setup-signout-btn"
                variant="ghost"
                className="w-full text-zinc-400 hover:bg-white/5 hover:text-white"
                onClick={onSignOut}
              >
                {setupCopy.actions.signOut}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
