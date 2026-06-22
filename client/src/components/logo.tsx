import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg bg-foreground text-background text-sm font-semibold",
        className,
      )}
    >
      A
    </span>
  )
}
