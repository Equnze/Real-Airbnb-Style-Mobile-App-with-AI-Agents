import { isClerkAPIResponseError } from "@clerk/expo";

const FALLBACK_MESSAGE = "Something went wrong. Try again.";

// Clerk flow methods resolve to { error }; API failures carry a list of coded errors.
export function clerkErrorCode(error: unknown) {
  return isClerkAPIResponseError(error) ? error.errors[0]?.code : undefined;
}

export function clerkErrorMessage(error: unknown) {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    return first?.longMessage ?? first?.message ?? FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
