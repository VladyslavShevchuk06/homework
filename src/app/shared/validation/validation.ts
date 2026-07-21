import { z } from 'zod'

export interface IValidationMessages {
  email: string
  password: string
  name: string
  passwordsMatch: string
}

export function buildLoginSchema(messages: Pick<IValidationMessages, 'email' | 'password'>) {
  return z.object({
    email: z.string().email(messages.email),
    password: z.string().min(8, messages.password),
  })
}

export function buildRegisterSchema(messages: IValidationMessages) {
  return z
    .object({
      name: z.string().min(2, messages.name),
      email: z.string().email(messages.email),
      password: z.string().min(8, messages.password),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMatch,
      path: ['confirmPassword'],
    })
}

export type TLoginInput = z.infer<ReturnType<typeof buildLoginSchema>>
export type TRegisterInput = z.infer<ReturnType<typeof buildRegisterSchema>>
