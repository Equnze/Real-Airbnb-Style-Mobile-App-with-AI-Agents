# 03 · Onboarding and sign-up UI

Status: done

## Goal

A new user opens Roam and sees three swipeable onboarding slides that match `assets/images/roam-onboarding.png`. From them they reach a Create account screen that matches `assets/images/roam-auth.png`. The screens validate input, but real sign-up arrives with the Clerk plan.

## Decisions

- **Slides:** three of them. Slide 1 is exactly the design. Slides 2–3 reuse its layout with new copy and photos (below). Swiping pages between slides. **Get started** advances on slides 1–2 and opens sign-up on slide 3.
- **Skip** opens sign-up. Onboarding shows on every launch for now; a "seen" flag belongs with the Clerk session plan. No storage dependency.
- **Continue with Google / Apple** and **Create account** have no backend yet. Create account validates (name required, email format, password ≥ 8) and shows field errors. A valid submit, or tapping Google/Apple, shows a success `AlertBanner`: "Sign-up connects in the next step (Clerk)." Each is marked `TODO(clerk)`.
- **Sign in** link → a minimal `/sign-in` placeholder screen (back button, heading, one line, link back to sign-up), marked `TODO(clerk)`.
- **Apple button:** iOS only. The `apple.logo` SF Symbol exists there, and Material Symbols has no Apple mark.
- **Sheet edge:** an SVG path with `react-native-svg` (new dependency, via `npx expo install`, included in Expo Go). The path was measured from the design in a 390-wide grid and stretches with screen width: `M0 72 L0 40 C0 14 14 0 44 0 L100 0 C200 0 290 18 352 32 C378 38 390 50 390 72 Z`.
- **Photos:** Unsplash, loaded remotely with `expo-image` (`?w=1200&q=80&auto=format&fit=crop`). All three are prefetched on mount so swipes don't flash blank.
- **Routing:**
  - `src/app/index.tsx` redirects to `/onboarding`. This replaces the current placeholder home; `/design-system` stays reachable by URL.
  - The root Stack hides headers by default, and the gallery turns its own header back on.
  - Auth routes live in an `(auth)` group.
- **Screen code:** pieces used by one screen live in `src/screens/<screen>/`, and routes in `src/app/` stay thin. Shared primitives come from `src/components/ui/`.
- **Status bar:** dark content on onboarding (light sky photo) and sign-up.
- **Copy:** matches the designs word for word, including the "e.g. Adrian Hajdin" placeholder. The slide 1 location pill keeps "Whistler, BC" from the design, although the chosen photo is Emerald Lake, BC.

### Slides

| # | Photo (Unsplash) | Pill | Title | Body |
|---|---|---|---|---|
| 1 | `photo-1510798831971-661eb04b3739` (lit lodge on a lake, pines, mountains) | Whistler, BC | Find a stay that fits your story | From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip. |
| 2 | `photo-1520250497591-112f2f40a3f4` (tropical villa pool) | Ubud, Bali *(sample)* | Describe it in one sentence | Try "quiet pet friendly cabin with a hot tub under $300" and roam ranks the stays that fit. |
| 3 | `photo-1587061949409-02df41d5e562` (forest cabin) | Big Sur, CA *(sample)* | Ask before you book | Get answers on cancellation, pets, and house rules, straight from each stay's own policies. |

The slide 2–3 copy follows the product brief in AGENTS.md. Pill locations marked *(sample)* are placeholders; I don't know where those photos were taken.

## Design → tokens

Measured from the designs (onboarding mockup scale 1.615 px/pt, auth mockup 1.74 px/pt). Values are on the 4pt grid unless noted.

**Onboarding**
- **Photo:** full bleed, `contentFit="cover"`.
- **Top bar:**
  - Inset `px-gutter` and the safe-area top.
  - `Wordmark` md on the left.
  - **Skip** pill on the right: `h-11 px-5 rounded-full bg-glass`, `caption` in ink.
- **Location pill:** sits 16pt above the sheet edge, left `px-gutter`. `h-10 px-4 gap-2 rounded-full bg-overlay`, 1pt `glass-line` border, white filled `pin` 16, `caption` in white.
- **Sheet:**
  - The SVG edge (72pt tall at 390 wide, scaling with width), then a `bg-surface` body.
  - Body padding: `px-gutter`, top 0, bottom safe-area + 16.
  - Text block gets an extra `px-1.5` (design text sits ~6pt inside the buttons).
- **Progress:** 3 segments, `h-1.5 w-8 gap-2 rounded-full`; active `bg-lavender`, others `bg-line`. 24pt below it, the title.
- **Title:** **new `hero` text variant** 38 / 1.05, Satoshi Black, -1px tracking. The designs' 36–38pt titles fall between `heading` (30) and `display` (56).
- **Body:** `body` variant, `tone="secondary"`, 12pt below the title.
- **Buttons:** 16pt below the body.
  - `Button` primary, `size="md"`, `trailingIcon="arrow-right"`, title "Get started".
  - 10pt gap (snapped to 12).
  - `Button` secondary `md` with `GoogleLogo`, "Continue with Google".

**Create account**
- **Top row:** back `IconButton` outline `md` on the left, `Wordmark` sm on the right; `px-gutter`, safe-area top + 8.
- **Heading:** "Create your account" in `hero`, 32pt below the top row.
- **Body:** `body` in `tone="muted"`, 12pt below. Copy: "Join roam to save your stays, get personalized recommendations and access them across all your devices."
- **Fields:** 24pt below, 16pt apart. `TextField` with stacked labels:
  - Full name (`user`, placeholder "e.g. Adrian Hajdin", `textContentType="name"`).
  - Email address (`mail`, "you@example.com", email keyboard, `autoCapitalize="none"`).
  - Password (`lock`, "At least 8 characters", `secure`).
  - Return key moves to the next field and submits on the last.
- **Create account:** `Button` primary `md`, `trailingIcon="arrow-right"`, 24pt below the fields.
- **"or" divider:** hairline `bg-line` lines with `caption` muted "or", 16pt margins. Local to the auth screens.
- **Social buttons:** `Button` secondary `md` for Google (with `GoogleLogo`) and, on iOS only, Apple (with the `apple.logo` symbol).
- **Footer:** "Already have an account?" in `caption` muted, then "Sign in" in `caption` ink, underlined, linking to `/sign-in`.
- **Keyboard:** the content scrolls (`keyboardShouldPersistTaps="handled"`) inside a `KeyboardAvoidingView`, so fields stay visible above the keyboard.

**Proposed new tokens**
- `--text-hero: 38px` with `--text-hero--line-height: 1.05` and `--text-hero--letter-spacing: -1px`, plus a `hero` variant in `Text`.
- `--color-glass-line: rgba(255,255,255,0.4)` for the location pill border (estimated).

**Icon registry addition:** `apple` (`apple.logo` on iOS; no Android name, so it's rendered only on iOS).

## Out of scope

- Clerk, real sign-up and sign-in, OAuth, and sessions.
- Remembering that onboarding was seen.
- The full Sign in screen design (no design attached yet).
- The real Google "G" and Apple logo assets. The Google placeholder from plan 02 remains.

## Steps

### 1. Routing and dependency

- `npx expo install react-native-svg`.
- Root `src/app/_layout.tsx`: `<Stack screenOptions={{ headerShown: false }} />`. `src/app/design-system.tsx` sets `headerShown: true`.
- `src/app/index.tsx` → `<Redirect href="/onboarding" />`.
- `src/app/(auth)/_layout.tsx`: a Stack with no headers.

Done when tsc passes and the app opens to an empty `/onboarding`.

### 2. Tokens and registry

- Add `hero` and `glass-line` to `src/global.css` (`@theme` + `:root`).
- Add the `hero` variant to `src/components/ui/text.tsx`.
- Add the `apple` icon to `icons.ts`. `IconSpec.android` becomes optional, and `Icon` renders nothing where a platform has no name.
- Add `hero` to the gallery's typography section.

### 3. Onboarding screen (`src/screens/onboarding/`)

- `slides.ts`: the table above.
- `sheet-edge.tsx`: the SVG path, white fill, `preserveAspectRatio="none"`, height `72 * width / 390`.
- `progress-dots.tsx`: segments with `accessibilityRole="progressbar"` and a value like "Step 1 of 3".
- `location-pill.tsx`.
- `onboarding-screen.tsx`:
  - A horizontal paging `FlatList` of full-screen slides (photo, pill, sheet with progress, title, body, buttons), plus a static top bar (wordmark, Skip).
  - Get started calls `scrollToIndex` or `router.push("/sign-up")`. Skip and Google push `/sign-up`; Google is `TODO(clerk)`.
  - `Image.prefetch` the three photos on mount.
  - `StatusBar style="dark"`.
- `src/app/onboarding.tsx` renders it.

### 4. Create account (`src/screens/auth/`)

- `or-divider.tsx`.
- `sign-up-screen.tsx`: the layout above. Local state for the fields, a `validate()` with messages ("Enter your name", "Enter a valid email address", "Use at least 8 characters"), and field refs for return-key focus. Valid submit or social tap shows the AlertBanner.
- `sign-in-screen.tsx`: the placeholder.
- `src/app/(auth)/sign-up.tsx` and `src/app/(auth)/sign-in.tsx` render them.

### 5. Compare on the phone and fix

Run on the Android phone over adb (see AGENTS.md). Screenshot all three slides, sign-up (empty, with errors, keyboard open), and sign-in. Compare each with its design, list every difference, fix, and repeat until they match.

## Verification

1. `npx tsc --noEmit`, `npx expo lint`, and `npx expo-doctor` pass. The hardcoded-value grep is clean.
2. `npx expo export` succeeds for android, ios, and web.
3. **On the phone:**
   - Cold start lands on slide 1, matching the design (photo, wordmark, Skip, pill, curved sheet, progress, copy, buttons).
   - Swipe through all three slides; the progress follows.
   - Get started advances, and on slide 3 opens sign-up. Skip opens sign-up.
   - Sign-up matches `roam-auth.png`. Back returns to onboarding.
   - Submitting empty shows three errors; fixing them clears them; a valid submit shows the banner.
   - The keyboard doesn't cover the focused field, and return moves between fields.
   - "Sign in" opens the placeholder, and its link returns.
4. **Web:** `/onboarding` and `/sign-up` render without hydration errors (screenshot).
5. Not checkable here: iOS (Apple button, glass Skip pill). Listed in the report.

## AGENTS.md updates

- Under **Design system**: the `hero` text variant (38/1.05 Black) for screen titles. Screen-specific components live in `src/screens/<screen>/`, and routes stay thin.
- Under **Expo**: auth routes live in the `(auth)` group. Onboarding shows on every launch until the Clerk plan adds a seen flag.

## Progress (paused before step 5)

Steps 1–4 are built; tsc passes. Lint, doctor, and exports haven't been run since.
- **Routing:** `src/app/index.tsx` redirects to `/onboarding`. The root Stack hides headers, and the `(auth)` group has `sign-up` and `sign-in`.
- **Onboarding:** `src/screens/onboarding/`: `slides.ts`, `sheet-edge.tsx` (SVG), `progress-dots.tsx`, `location-pill.tsx`, `onboarding-screen.tsx`.
- **Auth:** `src/screens/auth/`: `sign-up-screen.tsx`, `sign-in-screen.tsx`, `auth-header.tsx`, `or-divider.tsx`.
- **Shared changes:**
  - `TextField` accepts `ref` (RN 0.88 type: `TextInputInstance`).
  - `hero` text variant and `glass-line` color token.
  - iOS-only `apple` icon; `IconSpec.android` is now optional.
  - `pin` has a filled iOS symbol.
- **Web fix:** the onboarding pager renders only after mount on web. The server renders at 0×0, React won't patch those sizes on hydration, and `onLayout` didn't fire in headless Edge.
- **Web check (headless Edge, 520px):** sign-up matches `roam-auth.png`, and onboarding renders. The slide peek and bottom band seen there are headless window-size artifacts, still to confirm on a device.

**Next:** step 5. Reconnect the Android phone (`adb devices`), run `npx expo start --port 8082`, `adb reverse tcp:8082 tcp:8082`, then open `exp://127.0.0.1:8082`. Compare all three slides, sign-up (empty, errors, keyboard open), and sign-in with the designs, fix any differences, then run Verification and close out.

## Result

Steps 1–4 were built as planned. Step 5 (the phone comparison) ran as part of plan 04:
- all three slides and Create account render on the SM-A176U;
- Get started, Skip, and the progress dots work.

Fixes from that check are listed in plan 04's Result. The Sign in placeholder was replaced by plan 04's Sign in screen.

Left open:
- the real Google "G" asset (a placeholder is still in use);
- the slide 2 photo is a bungalow, not the planned villa pool;
- on slide 3 the dark wordmark has low contrast against the forest photo.
