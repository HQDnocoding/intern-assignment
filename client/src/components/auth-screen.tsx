import { useNavigate } from "react-router-dom"
import { SignInForm } from "@/components/auth/signin-form"
import { SignUpForm } from "@/components/auth/signup-form"

type AuthMode = "signin" | "signup"

type AuthScreenProps = {
  mode?: AuthMode
}

export function AuthScreen({ mode = "signin" }: AuthScreenProps) {
  const navigate = useNavigate()
  return mode === "signin" ? (
    <SignInForm onSwitch={() => navigate("/signup")} />
  ) : (
    <SignUpForm onSwitch={() => navigate("/signin")} />
  )
}
