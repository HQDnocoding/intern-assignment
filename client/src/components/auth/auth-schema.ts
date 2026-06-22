import { z } from "zod"
import { authCopy } from "@/lib/copy"

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, authCopy.validation.emailRequired)
    .regex(z.regexes.email, authCopy.validation.emailInvalid),
  password: z.string().min(1, authCopy.validation.passwordRequired),
})

export const signUpSchema = z.object({
  name: z.string().min(1, authCopy.validation.nameRequired),
  email: z
    .string()
    .min(1, authCopy.validation.emailRequired)
    .regex(z.regexes.email, authCopy.validation.emailInvalid),
  password: z
    .string()
    .min(1, authCopy.validation.passwordRequired)
    .min(8, authCopy.validation.passwordMinLength)
    .regex(/[A-Z]/, authCopy.validation.passwordUppercase),
})

export type SignInValues = {
  email: string
  password: string
}

export type SignUpValues = {
  name: string
  email: string
  password: string
}
