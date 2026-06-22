import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, Mail, UserRound } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/api"
import { authCopy, commonCopy } from "@/lib/copy"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthLayout } from "@/components/auth/auth-layout"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { signUpSchema, type SignUpValues } from "@/components/auth/auth-schema"

type SignUpFormProps = {
  onSwitch: () => void
}

export function SignUpForm({ onSwitch }: SignUpFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignUpValues) {
    setIsSubmitting(true)
    form.clearErrors("root")
    try {
      await api.post("/auth/signup", values)
      setSubmittedEmail(values.email)
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
      title={authCopy.signup.title}
      description={authCopy.signup.description}
      footer={authCopy.signup.footer}
      footerAction={submittedEmail ? "Sign in" : authCopy.signup.footerAction}
      onFooterAction={() => {
        if (submittedEmail) {
          navigate(`/signin?email=${encodeURIComponent(submittedEmail)}`, { replace: true })
          return
        }
        onSwitch()
      }}
    >
      <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        {submittedEmail ? (
          <Alert className="border-blue-500/80 bg-blue-500/5 text-blue-300">
            <AlertDescription className="text-sm leading-6 text-blue-300">
              {authCopy.signup.verificationSent}
            </AlertDescription>
          </Alert>
        ) : null}

        {submittedEmail ? null : (
          <>
            <AuthField
              id="name"
              label="Name"
              icon={UserRound}
              autoComplete="name"
              register={form.register("name")}
              error={form.formState.errors.name?.message}
            />

            <AuthField
              id="email"
              label="Email"
              icon={Mail}
              type="email"
              autoComplete="email"
              register={form.register("email")}
              error={form.formState.errors.email?.message}
            />

            <PasswordField
              id="password"
              label="Password"
              autoComplete="new-password"
              register={form.register("password")}
              error={form.formState.errors.password?.message}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((value) => !value)}
            />

            <p className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="inline-flex size-4 items-center justify-center rounded-full border border-zinc-500 text-[10px]">
                i
              </span>
              {authCopy.validation.passwordHint}
            </p>

            {form.formState.errors.root ? (
              <Alert variant="destructive" className="border-red-500/80 bg-red-500/5 text-red-400">
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              type="submit"
              data-testid="signup-btn"
              className="h-11 w-full rounded-md bg-white text-base font-medium text-black hover:bg-zinc-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting ? commonCopy.actions.pleaseWait : authCopy.signup.button}
            </Button>
          </>
        )}
      </form>
    </AuthLayout>
  )
}
