import { z } from "zod";

const emailSchema = z.email("Enter a valid email address.");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = signInSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;

export type AuthField = "email" | "password" | "confirmPassword";
export type AuthFieldErrors = Partial<Record<AuthField, string>>;

const AUTH_FIELDS: readonly AuthField[] = ["email", "password", "confirmPassword"];

export function authFieldErrors(error: z.ZodError): AuthFieldErrors {
  const fieldErrors: AuthFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (!isAuthField(key) || fieldErrors[key]) continue;
    fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function isAuthField(value: unknown): value is AuthField {
  return typeof value === "string" && AUTH_FIELDS.some((field) => field === value);
}
