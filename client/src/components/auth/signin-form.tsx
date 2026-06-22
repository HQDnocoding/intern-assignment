import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Mail } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api"
import { authCopy, commonCopy } from "@/lib/copy"
import type { AuthResponse } from "@/lib/types"
import { useAuthStore } from "@/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { signInSchema, type SignInValues } from "@/components/auth/auth-schema"

type SignInFormProps = {
  onSwitch: () => void
}

export function SignInForm({ onSwitch }: SignInFormProps) {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams()

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    mode: "onSubmit",
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  })

  async function onSubmit(values: SignInValues) {
    setIsSubmitting(true)
    form.clearErrors("root")
    try {
      const response = await api.post<AuthResponse>("/auth/login", values)
      setSession(response.data)
      navigate(
        response.data.nextStep === "setup"
          ? "/dashboard/onboarding?redirectTo=%2Fdashboard"
          : "/dashboard",
        { replace: true },
      )
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        commonCopy.errors.somethingWentWrong
      form.setError("root", { type: "server", message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title={authCopy.signin.title}
      description={authCopy.signin.description}
      footer={authCopy.signin.footer}
      footerAction={authCopy.signin.footerAction}
      onFooterAction={onSwitch}
    >
      <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <AuthField
          id="email"
          label="Email"
          icon={Mail}
          autoComplete="email"
          register={form.register("email")}
          error={form.formState.errors.email?.message}
        />

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          register={form.register("password")}
          error={form.formState.errors.password?.message}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword((value) => !value)}
        />

        {form.formState.errors.root ? (
          <Alert variant="destructive" className="border-red-500/80 bg-red-500/5 text-red-400">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        ) : null}

        <Button
          type="submit"
          data-testid="login-btn"
          className="h-11 w-full rounded-md bg-white text-base font-medium text-black hover:bg-zinc-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {isSubmitting ? commonCopy.actions.pleaseWait : authCopy.signin.button}
        </Button>
      </form>
    </AuthLayout>
  )
}
