# 04 · Sign up, verify, and sign in (mocked auth)

Status: done

## Goal

A guest can create an account, enter a 6-digit email code, and land on a signed-in placeholder home. From there they can sign out, then sign back in with email and password. Auth is mocked in memory with the same flow shape Clerk will use, so plan 05 (Clerk) swaps the implementation without touching the screens.

Builds on plan 03. The Create account screen (`src/screens/auth/sign-up-screen.tsx`) already matches `assets/images/roam-auth.png`, and its layout stays as it is.

## Decisions

- **Verification:** a 6-digit email code, the same shape as Clerk's email code. Any 6 digits pass (mocked), so there's no wrong-code state yet. `CodeField` still takes an `error` prop for Clerk.
- **Sign in:** email and password only. No Google or Apple buttons, and no "Forgot password?" (out of scope).
- **After auth:** a placeholder `/home` ("Welcome, <first name>" and Sign out). It gets replaced when the home design lands.
- **No designs for Verify, Sign in, or Home.** They reuse the Create account layout and existing tokens: `AuthHeader`, a `hero` title, a `body` muted intro, fields, a primary `md` button with `arrow-right`, and a caption footer link. No new tokens.
- **Mock auth:** `src/lib/auth/mock-auth.tsx` exports `AuthProvider` and `useAuth()`. State lives only in memory, so a reload signs you out. Every call waits 600ms (`MOCK_LATENCY_MS`) so loading states show. The file is marked `TODO(clerk)`.
  - `useAuth()` returns `{ isSignedIn, user, pendingSignUp, signUp, verifyEmail, resendCode, signIn, signOut }`.
  - `user`: `{ name, email } | null`.
  - `pendingSignUp`: `{ name, email } | null`, set by `signUp` and cleared by `verifyEmail`.
  - `signIn` accepts any valid email and password. It reuses the name from an earlier sign-up in the same session. Otherwise the name is empty, and home shows "Welcome back".
- **Routing guard:** the root Stack uses `Stack.Protected` (Expo Router SDK 58, https://docs.expo.dev/router/advanced/protected/):
  - `guard={!isSignedIn}`: `onboarding` and `(auth)`.
  - `guard={isSignedIn}`: `home`.
  - `index` and `design-system` are unguarded.
  - `index` redirects to `/home` when signed in and to `/onboarding` otherwise.
  - When the guard flips, Expo Router drops the auth history, so Back on home doesn't return to Verify.
- **Navigation:**
  - Create account → (valid submit) push `/verify`.
  - Verify → (code accepted) replace `/home`.
  - Verify's "Change email" → back to Create account, with the entered fields kept.
  - Opening `/verify` with no pending sign-up redirects to `/sign-up`.
  - Create account's "Sign in" and Sign in's "Create an account" use `router.replace`, so switching between them doesn't stack screens.
  - Home's Sign out → `signOut()`, then replace `/sign-in`.
- **Sign-up social buttons:** Google and Apple keep the "Sign-up connects in the next step (Clerk)." banner. The banner no longer shows on a valid submit, which now goes to Verify.
- **Resend:** a 30s cooldown (`RESEND_COOLDOWN_S`). Shows "Resend code in 0:30" (muted) counting down, then a "Resend code" link. Resending shows a success banner, "We sent a new code to <email>.", and restarts the cooldown.
- **Plan 03 close-out:** plan 03 step 5 (the phone comparison) is folded into this plan's phone check. Plan 03 is closed out at the end of this one.

## Screens (no design; built from the Create account layout)

Shared frame: `KeyboardAvoidingView` → `ScrollView` (`keyboardShouldPersistTaps="handled"`, `px-gutter`, paddingTop safe-area + 8, paddingBottom safe-area + 24). `StatusBar style="dark"`, `AuthHeader` at the top, and the title `mt-8`.

**Verify** (`/verify`)
- Title (`hero`): "Check\nyour email".
- Intro (`body` muted, `mt-3`): "We sent a 6-digit code to " + the email in `body` ink medium + ". Enter it below to verify your account."
- `AlertBanner` slot (`mt-6`) for the resend notice.
- `CodeField` (`mt-6`). It's autofocused, and filling the sixth digit submits.
- **Verify email** button: primary `md`, `arrow-right`, `mt-6`. Disabled until 6 digits are entered; `loading` while the check runs.
- Footer (`mt-6`, centered, `caption`): the resend countdown or link. Below it, `mt-3`: "Wrong email?" muted plus "Change it" ink underlined.

**Sign in** (`/sign-in`, replaces the plan 03 placeholder)
- Title: "Welcome\nback".
- Intro: "Sign in to see your saved stays and pick up where you left off."
- `AlertBanner` slot (`mt-6`), for future auth errors. Unused while mocked.
- Fields (`mt-6 gap-4`):
  - Email address: `mail`, "you@example.com", same props as sign-up.
  - Password: `lock`, placeholder "Your password", `secure`, `textContentType="password"`, `autoComplete="current-password"`.
  - Return key moves to the next field, then submits.
- Validation: "Enter a valid email address" and "Enter your password". Errors re-validate as you type after the first submit, as on sign-up.
- **Sign in** button: primary `md`, `arrow-right`, `mt-6`, `loading` while signing in.
- Footer (`mt-6`, centered): "New to roam?" muted plus "Create an account" ink underlined.

**Home** (`/home`, placeholder)
- Safe-area frame with `px-gutter`, and `Wordmark` sm at the top left.
- Title `hero` `mt-8`: "Welcome,\n<first name>", or "Welcome\nback" when there's no name.
- `body` muted `mt-3`: "You're signed in as <email>. Home arrives with its design."
- **Sign out** button: secondary `md`, `mt-6`.
- Marked `TODO(home)`.

**`CodeField`** (new shared component, `src/components/ui/code-field.tsx`)
- Props: `value`, `onChangeText`, `length = 6`, `onComplete?`, `error?`, `autoFocus?`, `className?`.
- Six boxes in a `flex-row gap-2`. Each box is `flex-1 h-14 rounded-xl border-2 items-center justify-center`, with the same state classes as `TextField`:
  - default `border-transparent bg-surface-gray`;
  - active (the next empty box while focused) `border-lavender bg-lavender-soft`;
  - error `border-danger bg-surface-gray`.
- Digits use `title` ink. The error text sits below in `caption` danger with `mt-1 px-5`, as in `TextField`.
- **Input:** one real `TextInput` laid absolutely over the boxes, with transparent text and a hidden caret.
  - `keyboardType="number-pad"`, `maxLength={length}`, non-digits stripped.
  - `textContentType="oneTimeCode"`, and `autoComplete` `"one-time-code"` on iOS/web, `"sms-otp"` on Android.
  - `accessibilityLabel="Verification code"`.
  - Tapping anywhere focuses it. Paste and autofill work because it's one input.
- Gallery: add a CodeField section to `/design-system` showing empty, partly filled, and error states.

## Out of scope

- Clerk and real auth, OAuth, sessions, and persisting sign-in across reloads.
- Forgot or reset password, and social sign-in on the Sign in screen.
- A wrong-code state on Verify (any 6 digits pass for now).
- The real home screen and tab bar.
- Remembering that onboarding was seen.

## Steps

### 1. Mock auth and routing

- Create `src/lib/auth/mock-auth.tsx` as described in Decisions.
- `src/app/_layout.tsx`:
  - Wrap the navigator in `AuthProvider`.
  - Split the Stack into `Stack.Protected` groups (`onboarding` and `(auth)` with `guard={!isSignedIn}`, `home` with `guard={isSignedIn}`).
  - Keep `headerShown: false` and the font gate.
- `src/app/index.tsx`: redirect by `isSignedIn`.
- Add `src/app/home.tsx`, rendering `src/screens/home/home-placeholder-screen.tsx`.

Done when tsc passes, the app opens to onboarding, and visiting `/home` signed out redirects away.

### 2. CodeField

- Create `src/components/ui/code-field.tsx` as specified.
- Add the gallery section in `src/app/design-system.tsx`.

Done when tsc passes and the gallery shows all three states.

### 3. Screens

- `sign-up-screen.tsx`:
  - A valid submit calls `signUp` with a button `loading` state, then pushes `/verify`.
  - Social buttons keep the banner.
  - "Sign in" uses `router.replace`.
- Create `src/screens/auth/verify-screen.tsx`, and `src/app/(auth)/verify.tsx` to render it.
- Rewrite `sign-in-screen.tsx` as specified.
- Create `src/screens/home/home-placeholder-screen.tsx`.

Done when tsc and lint pass.

### 4. Phone check and fixes

Run on the Android phone (see AGENTS.md: port 8082, `adb reverse`, Expo Go). Screenshot:
- the onboarding slides 1–3;
- Create account: empty, with errors, keyboard open, and loading;
- Verify: empty, partly filled, resend countdown, and after resend;
- Sign in: empty, errors, and keyboard open;
- Home.

Compare Create account and onboarding with their designs. Check the new screens for consistency with Create account (spacing, type, states). List every difference, fix, and repeat.

## Verification

1. `npx tsc --noEmit`, `npx expo lint`, and `npx expo-doctor` pass. The hardcoded-value grep over `src/app` and `src/components` is clean.
2. `npx expo export` succeeds for android, ios, and web.
3. **End to end on the phone:**
   1. Cold start → onboarding → Skip → Create account.
   2. Submit empty → three errors.
   3. Fill valid values → the button shows loading → Verify shows the entered email.
   4. "Change it" → back to Create account with the fields kept → submit again → Verify.
   5. Type 6 digits → it auto-submits → Home with "Welcome, <first name>".
   6. Android Back on Home doesn't return to Verify or Create account.
   7. Sign out → Sign in.
   8. Submit empty → errors.
   9. Valid email and password → loading → Home, with the name remembered from step 3.
   10. "Create an account" ↔ "Sign in" switches without growing the back stack.
4. **Resend:** the countdown runs from 0:30. At 0 the link shows; tapping it shows the banner and restarts the countdown.
5. **Guards:**
   - Opening `exp://127.0.0.1:8082/--/home` signed out lands on onboarding.
   - Opening `/verify` with no pending sign-up lands on Create account.
6. **Code entry:** paste and autofill fill all boxes, and non-digits are ignored.
7. **Web:** `/sign-in` and `/verify` (via the flow) render without hydration errors.
8. **Not checkable here:** iOS (Apple button, one-time-code autofill from Mail). Listed in the report.

## AGENTS.md updates

- **Who owns what → Auth:** until Clerk lands, `src/lib/auth/mock-auth.tsx` (`useAuth`) stands in for it. Screens call only `useAuth()`, so Clerk replaces that file's implementation, not the screens.
- **Expo:** signed-in routes are guarded with `Stack.Protected` in the root layout, and auth routes (`sign-up`, `verify`, `sign-in`) live in `(auth)`. This replaces the line "Onboarding shows on every launch until the Clerk plan…" with: `index` redirects to `/home` when signed in, otherwise to `/onboarding`.
- **Design system:** `CodeField` is the shared one-time-code input.

## Result

Built as planned: the mocked `useAuth`, `Stack.Protected` routing, `CodeField`, Verify, Sign in, and the placeholder Home. Sign-up now goes on to Verify. Checked on the phone (SM-A176U, Expo Go).

Changes during the phone check:
- **Sign out:** the guard flip overrode `router.replace("/sign-in")` and landed on onboarding. The signed-in group now uses `redirectTo="/sign-in"`, so opening `/home` signed out also lands on Sign in (not onboarding, as first planned).
- **CodeField:** the overlay input is hidden with `opacity-0`. `text-transparent` and an inline transparent color both still drew the digits on Android.
- **Button:** `loading` no longer dims to 40%, so the spinner stays visible.
- **Keyboard:** `KeyboardAvoidingView` uses `padding` on Android too (edge-to-edge means the window no longer resizes). The focused field is visible, but its bottom edge can sit just under the keyboard. A `KeyboardAwareScrollView` would fix that; it needs `react-native-keyboard-controller`. The user chose to leave it as is for now.
- **Onboarding (plan 03):**
  - pages are sized from `onLayout`, which removes a dark band above the Android nav bar;
  - the web mount flag uses `useSyncExternalStore` (lint).

Not checked: iOS (Apple button, one-time-code autofill, liquid glass). Clipboard paste into `CodeField` wasn't tried on the phone.
