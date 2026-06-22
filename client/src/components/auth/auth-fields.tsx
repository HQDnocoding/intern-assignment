import type { ComponentType } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type AuthFieldProps = {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  register: UseFormRegisterReturn
  error?: string
  type?: string
  autoComplete?: string
}

export function AuthField({
  id,
  label,
  icon: Icon,
  register,
  error,
  type = "text",
  autoComplete,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-zinc-200">
        {label}
      </Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          id={id}
          type={type}
          autoComplete={autoComplete}
          className={cn(
            "border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500 focus-visible:bg-white/7",
            error && "border-red-500 focus-visible:ring-red-500/30",
          )}
          aria-invalid={Boolean(error)}
          {...register}
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}

type PasswordFieldProps = Omit<AuthFieldProps, "icon"> & {
  showPassword: boolean
  onToggleShowPassword: () => void
}

export function PasswordField({
  id,
  label,
  register,
  error,
  autoComplete,
  showPassword,
  onToggleShowPassword,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-zinc-200">
        {label}
      </Label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          className={cn(
            "border-white/10 bg-white/5 pl-10 pr-10 text-white placeholder:text-zinc-500 focus-visible:bg-white/7",
            error && "border-red-500 focus-visible:ring-red-500/30",
          )}
          aria-invalid={Boolean(error)}
          {...register}
        />
        <Button
          type="button"
          onClick={onToggleShowPassword}
          variant="ghost"
          size="icon-xs"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  )
}
