# 01 · NativeWind v5 setup

Status: done

## Goal

Screens can be styled with Tailwind `className` props (NativeWind v5) on iOS, Android, and web, including `dark:` variants that follow the system theme. Source: https://www.nativewind.dev/v5/llms-full.txt and https://www.nativewind.dev/v5/getting-started/installation.

## Decisions

- Versions follow the doc exactly: `nativewind@5.0.0-rc.0` + `react-native-css@3.1.0-rc.0` (exact), dev `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss`, `lightningcss@1.30.1` (exact).
- We stay on Expo SDK 58 even though the RC's tested target is SDK 57 (user choice). We follow the doc and then verify fully. If SDK 58 breaks, stop and report instead of improvising.
- `lightningcss` is pinned with npm `overrides` to `1.30.1`, as the doc says. This also downgrades the copy `@expo/metro-config@58` uses (currently 1.33.0); verification must cover that.
- npm is the package manager (`package-lock.json`, no `bun.lock`). Never use `--force` or `--legacy-peer-deps`.
- `global.css` lives at `src/global.css` and is imported once from `src/app/_layout.tsx` (`import "../global.css"`).
- No `babel.config.js` exists, and none is needed: v5 has no babel preset and no `jsxImportSource`.
- Reanimated 4.7.1, Worklets 0.13.0, safe-area-context, and expo-system-ui are already installed. Re-run `npx expo install` on them only to confirm SDK-compatible versions.
- Dark mode: `app.json` already has `userInterfaceStyle: "automatic"`. Add `"expo-system-ui"` to `plugins`. `dark:` uses `prefers-color-scheme`. Use React Native's `useColorScheme`/`Appearance`, not NativeWind's deprecated hook.
- Smoke test: convert `src/app/index.tsx` from `StyleSheet` to `className`.

## Out of scope

- Design tokens / `@theme` design system (a later plan using the `expo-design-system` skill).
- Upgrading or downgrading the Expo SDK.
- Any other screens or components.

## Steps

### 1. Record the plan

Copy this plan to `prompts/01-nativewind-setup.md` and set `Status: approved`.

### 2. Install packages

```bash
npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui
npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1
```

Add to `package.json`:

```json
"overrides": { "lightningcss": "1.30.1" }
```

Then run `npm install` so the lockfile picks up the override. If npm reports ERESOLVE, stop and report; don't force it.
Done when `npm ls nativewind react-native-css lightningcss` shows the pinned versions, with every lightningcss at 1.30.1.

### 3. Config files (repo root)

- `postcss.config.mjs` (must be `.mjs` or `.js`, not `.cjs`):
  ```js
  export default {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
  ```
- `metro.config.js`:
  ```js
  const { getDefaultConfig } = require("expo/metro-config");
  const { withNativewind } = require("nativewind/metro");

  /** @type {import('expo/metro-config').MetroConfig} */
  const config = getDefaultConfig(__dirname);

  module.exports = withNativewind(config);
  ```
- `nativewind-env.d.ts` (commit it, and don't rename it to `nativewind.d.ts`). `tsconfig.json`'s `**/*.ts` include already covers it:
  ```ts
  /// <reference types="react-native-css/types" />
  ```
- `app.json`: add `"expo-system-ui"` to `expo.plugins`. Keep `userInterfaceStyle: "automatic"`.

### 4. CSS entry

Create `src/global.css` with split imports. Don't use a single `@import "tailwindcss"`, because React Native Web's defaults would override the utilities:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";

@import "nativewind/theme";
```

In `src/app/_layout.tsx`, add `import "../global.css";` as the first import and keep the `<Stack />`. If tsc complains about the CSS import, add `declare module "*.css";` to `nativewind-env.d.ts`.

### 5. Smoke-test screen

Rewrite `src/app/index.tsx` to use `className` with no `StyleSheet`:
- `View`: `flex-1 items-center justify-center bg-white dark:bg-black`
- `Text`: `text-lg font-semibold text-black dark:text-white`, keeping the copy "Okie Welcomes You."

## Verification

1. `npm ls nativewind react-native-css lightningcss` shows the pinned versions.
2. `npx @tailwindcss/cli@4.1.12 --input ./src/global.css --output <scratchpad>/out.css`, and `out.css` contains `.items-center` and `.dark\:bg-black`. This checks Tailwind output only.
3. `npx expo-doctor`: report any warnings, especially the lightningcss mismatch.
4. `npx tsc --noEmit` and `npx expo lint` pass.
5. `npx expo export --platform ios` and `npx expo export --platform web` bundle with no `global.css` deserialization errors.
6. `npx expo start --clear`, then open on web (`w`) and on an iOS simulator or device. The text is centered, bold, and larger. Switch the system theme to dark and the background turns black with white text.
7. If 5 or 6 fails on SDK 58, stop and report the exact error. Don't redesign.

## AGENTS.md updates

Add under **Expo** (or a new **Styling** section):
- Styling uses NativeWind v5 RC (`className`), pinned exactly: `nativewind@5.0.0-rc.0`, `react-native-css@3.1.0-rc.0`, `tailwindcss@4.1.12`, with `lightningcss` overridden to `1.30.1`. Don't bump them without checking the NativeWind v5 docs.
- `src/global.css` is imported only in `src/app/_layout.tsx`. Keep the split Tailwind imports. Theme tokens go in `@theme` in CSS (no `tailwind.config.js`).
- `dark:` follows the system theme. Use React Native's `useColorScheme`/`Appearance`, not NativeWind's. No `:root.dark` selectors.
- After changing metro/postcss/CSS config, restart with `npx expo start --clear`.

## Result

Installed and configured as planned on Expo SDK 58. Every `lightningcss` (including the copy in `@expo/metro-config`) resolves to 1.30.1. tsc, lint, and expo-doctor (20/20) pass. iOS and web exports build without deserialization errors, and the utilities and `dark:` rules appear in both bundles. Side effects: NativeWind added `nativewind-env.d.ts` to `tsconfig.json`'s `include`, and `expo lint` set up ESLint on its first run (`eslint`, `eslint-config-expo`, `eslint.config.js`). The on-device visual check (light and dark) wasn't run, because this is a Windows machine with no iOS simulator.
