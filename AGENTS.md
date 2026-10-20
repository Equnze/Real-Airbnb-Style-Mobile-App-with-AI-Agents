# Roam

Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered with exact text from Roam's own content.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server (press i for the iOS simulator)
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates (use instead of bare `eas`)
```

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from https://docs.expo.dev/llms.txt and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. API routes are `src/app/api/*+api.ts`. Keep components, hooks, and utils outside `src/app/`.
- Routes stay thin: a screen's own pieces live in `src/screens/<screen>/`. Auth screens (`sign-up`, `verify`, `sign-in`) are in the `(auth)` group. The root Stack guards with `Stack.Protected`: signed-out routes (`onboarding`, `(auth)`) and signed-in routes (`home`, with `redirectTo="/sign-in"`, which is also where Sign out lands). `index` redirects to `/home` or `/onboarding`. The root layout holds the splash (renders `null`) until fonts and Clerk's `isLoaded` are ready, so a restored session never flashes onboarding. Onboarding shows on every signed-out launch until a "seen" flag is added.
- Android is edge-to-edge, so the window doesn't resize for the keyboard or include the nav bar: use `KeyboardAvoidingView behavior="padding"` on every platform, and size full-screen pagers from `onLayout`, not `useWindowDimensions`.
- `ios/` and `android/` are generated. Never create or edit them by hand; configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, switch to a development build (`npx expo run:ios`).

## Styling

- NativeWind v5 RC (`className`), pinned exactly: `nativewind@5.0.0-rc.0`, `react-native-css@3.1.0-rc.0`, `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, and `lightningcss` forced to `1.30.1` through `overrides` in `package.json`. The RC is tested on SDK 57, and we run it on 58. Don't bump these without checking https://www.nativewind.dev/v5/llms-full.txt.
- `src/global.css` is imported only in `src/app/_layout.tsx`. Keep its split Tailwind imports (no single `@import "tailwindcss"`). Tokens go in CSS `@theme`, not `tailwind.config.js`. There's no babel preset; `metro.config.js` wraps the config with `withNativewind`.
- Light only (`userInterfaceStyle: "light"`). Don't use `dark:` until a dark palette exists; colors are CSS variables so one can be added later.
- After changing metro, postcss, or CSS config, restart with `npx expo start --clear`. Don't run the dev server with `CI=1` while editing: it turns off file watching and serves stale code.

## Design system

- Source of truth: `assets/images/roam-design.png`, plus the screen designs in `assets/images/roam-*.png`.
- Tokens live in `src/global.css` (`@theme` + matching `:root`, px values; `--spacing: 4px`). Exception: `--text-*--line-height` must be unitless ratios (1.5), because native multiplies a var-resolved line height by the font size (24px became 24 × 16).
- `metro.config.js` gives expo-asset the real `react-native` on native: the NativeWind RC's wrapper doesn't export `AssetRegistry` under RN 0.88, which silently stopped every font and asset from loading. Keep that override until NativeWind fixes it.
- Check UI changes on a real device, not only web: web hid both bugs above. With an Android phone on USB: `adb reverse tcp:8082 tcp:8082`, open `exp://127.0.0.1:8082/--/<route>` in Expo Go, and screenshot with `adb exec-out screencap -p`. `src/theme/` mirrors only what JS props need (icon tint, Switch, placeholder colors, motion) and must match. Never hardcode hex colors, font sizes, or off-grid spacing in `src/app` or `src/components`; add a token.
- Font: Satoshi (static OTFs in `assets/fonts/`, loaded with `useFonts` by PostScript name). One family per weight: `font-satoshi`, `-medium`, `-bold`, `-black` (`font-bold` doesn't switch faces). Use the `Text` component's variants (`display`, `heading`, `title`, `hero` for screen titles, `body`, `caption`, `label`, `button`, `wordmark`). The Satoshi license allows embedding in the app but not redistributing the files, so `assets/fonts/*.otf` is gitignored (the repo is public); the README says where to download them.
- Don't hold rendering on fonts on web (the server injects `@font-face`); doing so breaks hydration.
- Icons: `Icon` with semantic names from `src/components/ui/icons.ts` (SF Symbols on iOS, Material Symbols on Android/web, `filled` for active states). Add new icons there with both names.
- Shared components live in `src/components/ui/`, and `/design-system` (dev only) shows every one. Update the gallery when adding or changing a component. One-time codes use `CodeField`. NativeWind text colors don't reach a native `TextInput` on Android, so hide an overlay input with `opacity-0`. Third-party components (expo-image, GlassView, SymbolView) don't take `className`: size them with a wrapper View.
- On web, a `Pressable` with role button renders `<button>`. Never nest pressables inside pressables; make them siblings (see `ListingCard`).
- Liquid glass is iOS 26+ only (`TabBar` falls back to `glassFallback`). Never put opacity < 1 on a GlassView or its parents.

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth:** Clerk (`@clerk/expo`) is the source of truth, behind the app's own custom screens (no prebuilt UI). Email code only, no passwords; names live in Clerk first/last name. Screens use Clerk hooks directly with the method-based `useSignIn`/`useSignUp` API and `finalize()`, never `@clerk/expo/legacy` (the Clerk MCP snippets still show the legacy API, so check the installed types). Sign-in's code step reuses `/verify?mode=sign-in`. Error text comes from `src/lib/auth/clerk-errors.ts`. The publishable key is `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`; sessions persist via `tokenCache` + `expo-secure-store`. Configure the instance through the Clerk MCP (dry run first) or CLI.
- **Content:** Sanity (properties, hosts, policies, house rules). Studio is a standalone app in `studio/`. Schema deploys and content changes go through the Sanity MCP, and generated property copy uses Agent Actions.
- **Exact constraints** (price, guests, type, amenities, pets, place): GROQ filters, with values always passed as params.
- **Soft intent** (quiet, cozy, secluded): Dataset Embeddings via `text::semanticSimilarity()` inside `score()`.
- **Policy knowledge:** a Sanity Context endpoint in Knowledge Base mode. Context endpoints are created in the Dashboard's Context app and read with an organization token (Context Viewer), per https://www.sanity.io/docs/ai/context-migration-guide. One endpoint serves one mode. The Context skill still describes `sanity.agentContext` Studio documents with a project token; that route is deprecated, so don't use it.
- **Typed decisions** (which stay topics and policies answer a question): Jev, called from API routes through the AI SDK's `experimental_evaluate` with the `@ai-sdk/typesafe-ai` provider and `TYPESAFE_AI_API_KEY`. No Vercel AI Gateway. Keep `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions, since the API is experimental.
- **Answer text:** none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app.
- **Analytics:** PostHog, identified through Clerk.

## Rules

- Secret keys (Clerk secret key, TypeSafe key, Sanity organization token, Sanity write token) never reach the app bundle. Use them only in API routes and local scripts such as seeding. Never put them behind `EXPO_PUBLIC_`, which is bundled into the app. Never commit `.env`. Keep variable names, without values, in `.env.example`.
- Sanity Context needs a deployed Studio for the dataset. Redeploy Studio from `studio/` after schema changes.
- Jev is not an agent. It answers typed questions (Choice, Noul, Score) with probabilities. It never writes GROQ, calls tools, or generates text. Code builds queries from its answers.
- Prices, guest counts, and dates are parsed in code. Jev may choose between candidates code found, but never produces the value.
- Embeddings rank, they don't filter, and they only see the document itself (no references). Hard constraints are always GROQ filters, and text that should affect ranking lives on the property document.
- Policy answers show only text from the stay's data and Roam's policies, word for word. If nothing answers the question, say so and point to support.
- API routes verify the Clerk session before doing any work.
- Screens that create a Clerk sign-up render `<View nativeID="clerk-captcha" />` (bot protection's mount point).
- `finalize({ navigate })` runs before the session is set, so don't navigate to guarded routes there; let the signed-in redirect do it.
- PostHog failures never block the app. Never send what guests type, tokens, or personal data in events.
- Let Sanity generate document IDs. Model relationships as references.
- Ask before adding a dependency or service, changing the Sanity schema once content exists, or deleting data. Prefer Expo modules over third-party libraries.
- Whenever you need input from the user, ask through your tool's built-in question panel so they pick from options instead of typing. Give two to four clear options with the recommended one first. Fall back to plain text only if no such panel exists.

## How we build features

For a new feature or a change across several files. Small fixes and questions skip this.

1. **Understand.** Read the code involved. Open an earlier plan only if this feature builds directly on it (pick by file name). Read the current docs pages for the APIs you'll use, and load a matching skill if one exists (e.g. the Expo, Clerk, Sanity, Sanity Context, or TypeSafe skills). Don't write version-specific APIs from memory.
2. **Ask.** If a real decision is unclear (scope, visible behavior, data shape), ask in the question panel, batching questions into one round and following up only if the answers raise new ones. Pick defaults for the rest and list them. If a decision in this file looks wrong, raise it instead of changing it.
3. **Plan.** Copy `prompts/TEMPLATE.md` to `prompts/NN-feature-name.md` (next number) and fill it in. The plan must be self-contained, so a fresh session can build it from this file plus the plan alone.
4. **IMPORTANT: stop and wait.** Write no app code until the user approves the plan. Ask for approval in the question panel (approve, or request changes). If they request changes, update the plan and ask again. On approval, set `Status: approved`.
5. **Build** step by step, checking each one. If a step turns out wrong, stop and explain instead of redesigning.
6. **Close out.**
   - Run the plan's Verification and give the report described under Reporting.
   - Add a short `## Result` to the plan and set `Status: done`.
   - Update this file: put each lasting decision in the section it belongs to. Replace or remove rules that are no longer true instead of appending. Keep this file under 150 lines.

## Building from designs

Designs are attached in the chat. Screens must match them exactly: layout, spacing, sizes, colors, type, radii, icons, and copy.

- Icons, fonts, and brand images come from `assets/` or the chosen icon library, never recreated from a screenshot. Sample property photos may be remote placeholder images. If an asset is missing, use a marked placeholder and list it.
- Map every color, font, spacing value, and radius to a design-system token. List values with no token in the plan as proposed new tokens instead of hardcoding them. When creating the design system itself, derive the tokens from the designs.
- UI plans describe the design (elements, states, tokens, assets) well enough to build without the image. If building in a new session, ask for the design to be attached again.
- After building, open the screen in the iOS simulator (deep link with `xcrun simctl openurl booted <url>` when it isn't the first screen; the scheme is in `app.json`), take a screenshot (`xcrun simctl io booted screenshot <path>`), and compare it with the design. List every difference, fix, and repeat. Report which values were estimated from an image.

## Reporting

End every piece of work that changes code (features and fixes, not answers to questions) with this report. Use these headings in this order, and leave out any section that would be empty.

- **Done:** one line on the outcome, then the files changed and what changed in each.
- **Verified:** each check with ✅ or ❌ and its evidence (command output, screenshot). List what wasn't checked as ❌ with the reason. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take, such as keys, dashboard settings, manual steps in Sanity, or assets to provide.
- **Test it yourself:** numbered steps to reproduce the result from a fresh start, ending with `Expected:` and what the user should see.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## Checks

- Lint and type check pass before any task is called done.
- Screens that load data handle loading, error, and empty states.
- AI features are tried against realistic inputs, and failures are explained by cause: missing data, the decision Jev made, the query, or the code.
