# Roam: Airbnb-style mobile app with AI agents

Roam is an Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered word for word from Roam's own content.

> **Status: early build.** The design system, onboarding, and email-code auth with Clerk are done. Search, stay details, and policy answers come next.

## What works today

- **Design system:** Satoshi type, color/spacing/radius tokens, and 20 shared components (buttons, fields, chips, listing and policy cards, tab bar, and more). A dev-only `/design-system` route shows all of them.
- **Onboarding:** a swipeable intro shown to signed-out users.
- **Auth with Clerk, no passwords:**
  - Sign up with name and email, then confirm with a 6-digit code sent by email.
  - Sign in with email and a new code.
  - Sessions persist across app restarts (stored in the device's secure storage).
  - Signed-out users can't reach `home`, and signing out returns to sign-in.

## Planned architecture

Each tool has one job:

| Concern | Tool |
| --- | --- |
| Auth | [Clerk](https://clerk.com) (`@clerk/expo`), custom screens |
| Content (properties, hosts, policies, house rules) | [Sanity](https://www.sanity.io) |
| Exact filters (price, guests, type, amenities, pets, place) | GROQ filters with params |
| Soft intent ("quiet", "cozy", "secluded") | Sanity Dataset Embeddings, `text::semanticSimilarity()` |
| Policy knowledge | Sanity Context endpoint (Knowledge Base mode) |
| Typed decisions (which topics and policies answer a question) | Jev, called from API routes through the AI SDK |
| Analytics | PostHog |

No LLM writes answer text: answers show the stay's own fields and policy text with their source. Prices, guest counts, and dates are parsed in code.

## Tech stack

- Expo SDK 58, React Native 0.88, React 19, Expo Router (file-based routes, `Stack.Protected` guards)
- NativeWind v5 (Tailwind CSS 4) for styling
- TypeScript, React Compiler, typed routes

## Getting started

### 1. Install

```bash
npm install
```

### 2. Add the Satoshi fonts

The font license allows embedding in apps but not redistributing the files, so they aren't in this repo. Download Satoshi from [Fontshare](https://www.fontshare.com/fonts/satoshi) and copy these four files from `Fonts/OTF` into `assets/fonts/`:

```
Satoshi-Regular.otf  Satoshi-Medium.otf  Satoshi-Bold.otf  Satoshi-Black.otf
```

### 3. Set up Clerk

1. Create an application in the [Clerk Dashboard](https://dashboard.clerk.com).
2. Under **User & authentication**, turn on email address with **email verification code** for sign-up and sign-in, turn passwords off, and turn on first and last name (optional).
3. Under **Native applications**, turn on the Native API.
4. Copy `.env.example` to `.env.local` and add your publishable key:

   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

   `CLERK_SECRET_KEY` is only for future API routes and scripts. Never give a secret key the `EXPO_PUBLIC_` prefix, because those values are bundled into the app.

### 4. Run

```bash
npx expo start
```

Then press `i` for the iOS simulator or `a` for Android, or scan the QR code with Expo Go.

## Commands

```bash
npx expo install <package>  # add packages (resolves SDK-compatible versions)
npx expo start              # dev server
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # check dependencies and config
```

## Project structure

```
src/
  app/            routes (screens and layouts only; keep them thin)
    (auth)/       sign-up, verify, sign-in
    _layout.tsx   ClerkProvider and route guards
  screens/        each screen's own pieces
  components/ui/  shared design-system components
  lib/auth/       Clerk error helpers
  theme/          values JS props need (icon tints, motion)
  global.css      design tokens (@theme)
assets/images/    design references (roam-*.png) and app icons
prompts/          feature plans, one per feature, in build order
AGENTS.md         project rules and decisions for AI coding agents
```

## Built with AI agents

This app is built with AI coding agents working from [`AGENTS.md`](AGENTS.md). For each feature, the agent reads the code and current docs, writes a plan in [`prompts/`](prompts), waits for approval, builds it, and verifies it. The plans in `prompts/` are the history of how the app came together.
