import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type AuthLayoutProps = {
  title: string
  description: string
  footer: string
  footerAction: string
  onFooterAction: () => void
  children: ReactNode
}

export function AuthLayout({
  title,
  description,
  footer,
  footerAction,
  onFooterAction,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(180deg,#0a0a0a_0%,#101010_100%)] text-foreground">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col items-center justify-center px-4 py-10">
        <Card className="w-full max-w-95 border-border/70 bg-[rgba(24,24,24,0.92)] text-white shadow-2xl shadow-black/30 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-[1.45rem] font-semibold tracking-tight text-white">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-zinc-400">{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">{children}</CardContent>
          <div className="px-6 pb-6">
            <Separator className="mb-4 bg-white/10" />
            <div className="text-center text-sm text-zinc-400">
              {footer}{" "}
              <Button
                type="button"
                data-testid="footer-action-btn"
                onClick={onFooterAction}
                variant="link"
                className="h-auto p-0 font-medium text-white underline underline-offset-4 hover:underline"
              >
                {footerAction}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
