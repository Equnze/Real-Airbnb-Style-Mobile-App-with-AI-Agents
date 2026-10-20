# 05 · Clerk auth (email code, no passwords)

Status: done

## Goal

A guest signs up with their name and email, enters the 6-digit code Clerk emails them, and lands on home. Later they sign in with just their email and a new emailed code. Sessions persist across app restarts, signed-out users are kept off `home`, and Sign out returns to sign-in. The in-memory mock (`src/lib/auth/mock-auth.tsx`) is deleted.

Builds on plan 04. Screens keep their layouts; only the password fields go away.

## Decisions

- **Clerk app:** "Roam" (`app_3KyY4z3EOgzy0KsF2cCPw2tAT5x`), development instance. `.env.local` already has `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` for it (and `CLERK_SECRET_KEY`, unused by the app).
- **SDK:** `@clerk/expo` 4.13.1, already installed. Use the current method-based API, which was checked against the installed `node_modules/@clerk/shared/dist/types/signInFuture.d.ts` and `signUpFuture.d.ts`. `useSignIn()` returns `{ signIn, errors, fetchStatus }` and `useSignUp()` returns `{ signUp, errors, fetchStatus }`; every method resolves to `{ error }`; `finalize({ navigate })` activates the session. Never use `setActive` or `prepareFirstFactor`/`attemptFirstFactor` from `@clerk/expo/legacy`. (The Clerk MCP `custom-flows` snippet still shows that legacy API; ignore it.)
- **Instance config (via Clerk MCP `patch_instance_config`, dry run already passed):**
  - `auth_password.enabled: false`, `auth_password.required: false` (was required, min 15).
  - `user_model.first_name` and `last_name`: `enabled: true`, `required: false`.
  - Unchanged: `auth_email` (`sign_in_strategies: ["email_code"]`, `verification_strategies: ["email_code"]`, `verify_at_sign_up: true`), Google OAuth enabled but unused, bot protection off, session max lifetime 7 days.
- **Name:** split "Full name" on the first whitespace → `firstName`, rest → `lastName` (omitted if empty). Home greets with `user.firstName`.
- **Persistent sessions:** `tokenCache` from `@clerk/expo/token-cache` (already on `ClerkProvider`), which needs `expo-secure-store`. Add it with `npx expo install expo-secure-store` (approved). It's bundled in Expo Go.
- **No `@clerk/expo` config plugin:** it only registers native modules for prebuilt components and native Google/Apple sign-in, which this plan doesn't use. Everything here runs in Expo Go.
- **Screens use Clerk hooks directly** (`useAuth`, `useUser`, `useClerk`, `useSignIn`, `useSignUp` from `@clerk/expo`). No wrapper context: Clerk's flow objects are the state. One small helper, `src/lib/auth/clerk-errors.ts`, turns a Clerk `{ error }` into a message for a field.
- **Sign-in code step reuses Verify:** `/verify?mode=sign-up|sign-in`. Same `CodeField`, resend countdown, and "Change it" link.
- **Loading:** the root layout keeps the splash up until fonts are loaded **and** `useAuth().isLoaded` is true, so a restored session never flashes onboarding. On web it renders `null` until `isLoaded` (the server and the client's first pass both render `null`, so hydration still matches; fonts still don't hold web rendering).
- **Routing:** unchanged `Stack.Protected` structure, now driven by Clerk's `isSignedIn`. `home` keeps `redirectTo="/sign-in"`, so Sign out (and opening `/home` signed out) lands on sign-in.
- **After a code is accepted:** `finalize({ navigate })` with a `navigate` that does `router.replace("/home")`. If `session.currentTask` is set (none is configured), it logs a warning and stays put. Plan 04 relied on the guard flip to leave Verify, and an explicit replace is more predictable.
- **Errors (shown under the field they belong to):**
  - Sign up, email already used (`form_identifier_exists`): "An account with this email already exists. Sign in instead."
  - Sign in, unknown email (`form_identifier_not_found`): "No account uses this email. Create one instead."
  - Wrong or expired code: Clerk's message on `CodeField`'s `error` prop. The field clears its error when the user types.
  - Anything else: Clerk's `longMessage ?? message` in an `AlertBanner tone="error"` (check the banner's tones; if there's no error tone, use the field under the button).
- **Captcha:** the sign-up screen renders `<View nativeID="clerk-captcha" />` above the Create account button, so turning on bot protection later works without code changes.
- **Copy changes:**
  - Sign in: the password field is removed. The button stays "Sign in", and pressing it sends the code.
  - Sign up: the password field is removed.
  - Verify in sign-in mode: body is "We sent a 6-digit code to **email**. Enter it below to sign in." and the button is "Sign in". Sign-up mode keeps "…to verify your account." and "Verify email".
  - Google/Apple notice: "Google and Apple sign-in are coming soon." (was "connects in the next step (Clerk)").
- **Design difference:** `roam-auth.png` shows a password field on Create account. It's removed on purpose, because you asked for no passwords.

## Out of scope

- Google/Apple sign-in (buttons stay, showing the notice).
- An onboarding "seen" flag (onboarding still shows on every signed-out launch).
- Combined sign-in-or-up on one screen (separate screens already exist).
- API-route session verification and PostHog identify (later plans).
- Production Clerk instance.

## Steps

### 1. Clerk instance config

Apply the dry-run patch above with `mcp__clerk__patch_instance_config` (no `dry_run`) to the development instance. Then read it back with `get_instance_config` (keys `auth_password`, `user_model`, `auth_email`) and confirm the values. Done when passwords are off and first/last name are enabled and optional.

### 2. Dependency

`npx expo install expo-secure-store`. If it adds an `expo-secure-store` entry to `app.json` plugins, keep it. Done when `npx expo-doctor` raises no new issues.

### 3. Root layout and index

- `src/app/_layout.tsx`: remove the `AuthProvider` import and wrapper. In `RootStack`, use `useAuth()` from `@clerk/expo`. Keep the splash until `isLoaded` too: move the `SplashScreen.hideAsync()` call into `RootStack` once both fonts and `isLoaded` are ready, and return `null` while `!isLoaded`. Keep the missing-key error.
- `src/app/index.tsx`: `useAuth()` from `@clerk/expo`.

### 4. `src/lib/auth/clerk-errors.ts`

`clerkErrorMessage(error)`: returns the first error's `longMessage ?? message`, or a generic "Something went wrong. Try again." Also `clerkErrorCode(error)`, which returns the first error's `code`. Check the shape of `ClerkError` in the installed types before writing it.

### 5. Sign up (`src/screens/auth/sign-up-screen.tsx`)

- Fields: `name`, `email`. Validation: name required, valid email.
- Submit: `signUp.create({ emailAddress, firstName, lastName })`, then `signUp.verifications.sendEmailCode()`, then `router.push({ pathname: "/verify", params: { mode: "sign-up" } })`.
- Errors as in Decisions. `loading` comes from `fetchStatus === "fetching"` or local state while chaining.
- Add the `clerk-captcha` view and update the notice copy.

### 6. Sign in (`src/screens/auth/sign-in-screen.tsx`)

- Field: `email` only. Remove the password field and its ref.
- Submit: `signIn.emailCode.sendCode({ emailAddress })`, then push `/verify?mode=sign-in`.
- Show the unknown-email error on the email field.

### 7. Verify (`src/screens/auth/verify-screen.tsx`)

- Read `mode` with `useLocalSearchParams`.
- Guard:
  - Sign-up mode redirects to `/sign-up` unless `signUp.status === "missing_requirements"` and `signUp.unverifiedFields` includes `email_address`.
  - Sign-in mode redirects to `/sign-in` unless `signIn.status === "needs_first_factor"`.
  - When already signed in, redirect to `/home`.
- Email shown: `signUp.emailAddress` or `signIn.identifier`.
- Submit:
  - Sign up: `signUp.verifications.verifyEmailCode({ code })`, then `signUp.finalize({ navigate })` if `status === "complete"`.
  - Sign in: `signIn.emailCode.verifyCode({ code })`, then `signIn.finalize({ navigate })`.
  - On error: set the `CodeField` error and clear the code.
- Resend:
  - Sign up: `signUp.verifications.sendEmailCode()`.
  - Sign in: `signIn.emailCode.sendCode()` with no args, because the sign-in already exists.
- "Change it": `reset()` the flow, then `router.back()`.
- Copy per mode as in Decisions.

### 8. Home and sign out (`src/screens/home/home-placeholder-screen.tsx`)

`useUser()` for `user.firstName` and `user.primaryEmailAddress?.emailAddress`. `useClerk().signOut()` on the button, with a loading state. The guard then sends the user to `/sign-in`.

### 9. Remove the mock

Delete `src/lib/auth/mock-auth.tsx` (and `src/lib/auth/` if it ends up empty apart from `clerk-errors.ts`, which stays). `grep -r "mock-auth" src` returns nothing.

### 10. Env example

Create `.env.example` with `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=` (names only).

## Verification

- `npx tsc --noEmit` and `npx expo lint` pass. `npx expo-doctor` raises no new issues.
- On the Android phone (Expo Go, `adb reverse tcp:8082 tcp:8082`), with screenshots:
  1. Fresh launch shows onboarding. Create account with a real inbox, using a `+clerk_test` address for the second run (Clerk dev test emails accept code `424242`). Verify shows the email, the code from the inbox signs in, and home shows "Welcome, <first name>".
  2. Kill the app and reopen it: home again, with no onboarding flash (persistent session).
  3. Sign out lands on sign-in.
  4. Sign in with the same email: a code is sent and Verify shows sign-in copy. The code lands on home.
  5. Errors: a wrong code shows on `CodeField`, an already-used email on sign-up shows on the email field, and an unknown email on sign-in shows on the email field.
  6. Resend after 30s sends a new code. "Change it" returns to the form.
  7. Opening `exp://127.0.0.1:8082/--/home` while signed out lands on sign-in.
- Check in the Clerk dashboard (or with `list_users`) that the new user has first/last name set and no password.

## AGENTS.md updates

- **Who owns what → Auth:** replace the mock sentence with: Clerk (`@clerk/expo`, current method-based `useSignIn`/`useSignUp` + `finalize`, never `@clerk/expo/legacy`). Email code only, no passwords. Names live in Clerk first/last name. Screens use Clerk hooks directly, and the sign-in code step reuses `/verify?mode=sign-in`. The publishable key is `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, and sessions persist through `tokenCache` + `expo-secure-store`.
- **Expo → routing line:** the root layout holds the splash until Clerk `isLoaded`. Remove "until Clerk adds a 'seen' flag" wording only if it changes (it doesn't here).
- **Rules:** sign-up screens render `<View nativeID="clerk-captcha" />`.

## Result

Built as planned. One change: `finalize`'s `navigate` callback runs *before* the session is set (per the installed types), so it only logs pending session tasks; Verify's existing `isSignedIn → /home` redirect moves on once the session is active (a `router.replace("/home")` there would hit home's guard while still signed out). Clerk instance config applied and read back. `tsc`, `expo lint`, `expo-doctor` (20/20), and an Android export all pass; the secret key is not in the bundle. Device run-through not done yet (no phone connected).
