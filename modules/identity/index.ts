export type { UserProfile } from "./domain/types";
export {
  authFieldErrors,
  signInSchema,
  signUpSchema,
  type AuthFieldErrors,
  type SignInInput,
  type SignUpInput,
} from "./domain/auth-schema";
export {
  AUTH_NOT_CONFIGURED,
  classifySignUp,
  mapSignInError,
  mapSignUpError,
} from "./application/auth-errors";
export { signInWithEmail, type SignInResult } from "./application/sign-in";
export { signUpWithEmail, type SignUpResult } from "./application/sign-up";
export { signOutCurrentUser } from "./application/sign-out";
