import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { setupCopy } from "@/lib/copy"
import { LogoMark } from "@/components/logo"

type SetupVerifyCardProps = {
  verified: boolean
  onSignIn: () => void
}

export function SetupVerifyCard({ verified, onSignIn }: SetupVerifyCardProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,#0a0a0a_0%,#101010_100%)]">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-white">Acme</span>
        </div>
        <Card className="w-full max-w-105 border-border/70 bg-[rgba(24,24,24,0.92)] text-white shadow-2xl shadow-black/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{setupCopy.messages.verifyCompleteTitle}</CardTitle>
            <CardDescription className="text-zinc-400">
              {verified
                ? setupCopy.messages.verifyCompleteDescription
                : setupCopy.messages.verifyCompletePending}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-white/10 bg-white/5 text-zinc-300">
              <AlertDescription className="text-sm text-zinc-300">
                {setupCopy.messages.verifyCompleteBody}
              </AlertDescription>
            </Alert>
            <Button
              data-testid="verify-signin-btn"
              className="h-11 w-full bg-white text-black hover:bg-zinc-200"
              onClick={onSignIn}
            >
              {setupCopy.actions.signIn}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
