# 02 · Design system

Status: done

## Goal

Every screen draws from one Roam design system that matches `assets/images/roam-design.png`. It covers Satoshi fonts, color, type, spacing, radius, and shadow tokens, plus a shared component for each of the sheet's 15 sections. A dev-only gallery route shows them all for checking against the sheet.

## Decisions

- **Reference:** `assets/images/roam-design.png` is the source of truth. The screen designs (`roam-home`, `-search`, `-property-details`, `-auth`, `-profile`, `-onboarding`) fill gaps (stacked input labels, white icon buttons on photos, dark overlay pills). Values marked *est.* were sampled from the image, not labelled on it.
- **Font: Satoshi** (Fontshare, ITF Free Font License). Use the static OTFs Regular, Medium, Bold, and Black (Black for the wordmark), stored in `assets/fonts/` and named by PostScript name (`Satoshi-Regular`, etc., already checked). The license allows embedding in apps but not redistributing the files, so gitignore `assets/fonts/*.otf` if the repo ever goes public. There's no remote today.
- **Font loading:** use `useFonts` in `src/app/_layout.tsx`, keyed by PostScript name, with the splash screen held until fonts load. This works in Expo Go, on web, and in dev builds; the expo-font config plugin would need a dev build and doesn't cover web. Each weight is its own family, per NativeWind: `font-bold` sets `fontWeight`, not the family.
- **Tokens live in `src/global.css`** as `@theme` (to generate utilities) plus matching `:root` variables, per NativeWind v5. Values are in px, including `--spacing: 4px`, so nothing depends on rem conversion. `src/theme/` mirrors only the values JS needs: colors for `SymbolView` `tintColor`, `Switch` `trackColor`, `placeholderTextColor`, and `ActivityIndicator`, plus motion durations. Each mirror carries a comment pointing at `global.css`.
- **Light only:** set `app.json` `userInterfaceStyle` to `"light"` and drop `dark:` usage. Colors stay variables so a dark palette can be added later.
- **Screen background:** white (`bg-surface`), as all six screens show. Surface Gray is for inputs, chips, icon buttons, and grouped sections. The sheet labels it "app background", but the screens don't use it that way.
- **Icons:** use `expo-symbols` `SymbolView` with per-platform names (SF Symbols on iOS, Material Symbols on Android and web) through one `Icon` component and a semantic name registry. Filled active states (home, heart, star, paw) use `.fill` SF Symbols on iOS and the `MaterialSymbols_400Regular_Filled` face elsewhere. That face needs the new top-level dependency `@expo-google-fonts/material-symbols`, already present as an expo-symbols dependency.
- **Glass:** `expo-glass-effect` `GlassView` on iOS 26+, with a `rgba(255,255,255,0.85)` background when `isLiquidGlassAvailable()` is false or Reduce Transparency is on. Never put opacity < 1 on a GlassView or its parents.
- **Tab bar:** a presentational `TabBar` + `TabBarItem` (yellow pill on the focused item) built to drop into `expo-router/ui` `TabList`/`TabTrigger asChild`. NativeTabs can't draw the yellow pill on iOS 26. Wiring it into real tab routes belongs to the navigation plan.
- **Toggle:** React Native `Switch` with brand track colors, which matches the sheet. **Segmented control and stepper** are custom, because the sheet's dark-pill segment and outlined stepper don't match the native controls.
- **Corners:** non-pill radii also get `borderCurve: "continuous"` (iOS).
- **Missing assets:** the Google "G" logo. Until it's provided, use a marked placeholder (`assets/images/placeholder-google.png` doesn't exist yet, so render a gray circle with "G" and a `// TODO(asset)` comment). The listing photo in the gallery is a remote placeholder image.

## Tokens

**Colors** (`--color-*` → `bg-*`, `text-*`, `border-*`):

| Token | Value | Use |
|---|---|---|
| `primary` | `#FFC629` | primary buttons, active chip/tab, toggle |
| `primary-pressed` | `#F2B200` *est.* | pressed primary |
| `lavender` | `#C9B4FF` | secondary actions, selected filter chip, focus ring |
| `lavender-soft` | `#F0ECFF` *est.* | policy card, focused field, accent badge |
| `violet` | `#5F31F8` *est.* | policy icons, chevrons, links on lavender |
| `ink` | `#0B0B1A` | headings, primary text, segmented selected bg |
| `ink-secondary` | `#6B7280` | body/secondary text |
| `ink-muted` | `#A0A4AE` *est.* | placeholders, "/ night" |
| `surface` | `#FFFFFF` | screens, cards, sheets |
| `surface-gray` | `#F4F5F7` | inputs, chips, icon buttons, groups |
| `line` | `#E5E7EB` | dividers, outlines |
| `glass` | `rgba(255,255,255,0.7)` | tab bar, glass surfaces |
| `overlay` | `rgba(11,11,26,0.55)` *est.* | pills on photos ("1 / 24", location) |
| `star` | `#FDB805` *est.* | rating stars |
| `success` / `success-soft` | `#0E7A4A` / `#DFF1EA` *est.* | success alert, "New" badge |
| `danger` / `danger-soft` | `#DD3A4D` / `#FDDFE8` *est.* | error alert |
| `info` / `info-soft` | `#2C4FB2` / `#EAF0FD` *est.* | "Superhost" badge |
| `promo` / `promo-soft` | `#D6336C` / `#FEE7F0` *est.* | "20% off" badge |
| `favorite-soft` | `#FEF5DC` *est.* | "Guest favorite" badge |

**Fonts:** `--font-sans: "Satoshi-Regular"`, `--font-sans-medium: "Satoshi-Medium"`, `--font-sans-bold: "Satoshi-Bold"`, `--font-sans-black: "Satoshi-Black"`.

**Type** (`--text-*` with `--line-height` and `--letter-spacing`). The `Text` component pairs each with its family:

| Variant | Size / line height | Family | Tracking |
|---|---|---|---|
| `display` | 56 / 1.0 (sheet: 56–64) | bold | -0.03em *est.* |
| `heading` | 30 / 1.2 (sheet: 28–32) | bold | -0.02em *est.* |
| `title` | 20 / 1.25 *est.* (card titles, prices) | bold | -0.01em |
| `body` | 16 / 1.5 | regular | 0 |
| `caption` | 14 / 1.43 | medium | 0 |
| `label` | 12 / 1.33 *est.* (tab labels, small tags) | medium | 0 |
| `button` | 17 / 1.2 (sheet: 17–18) | medium | 0 |
| `wordmark` | 48 / 1.0 *est.* | black | -0.04em *est.* |

**Spacing:** `--spacing: 4px`, so Tailwind's default scale is the 4-pt grid (`p-4` = 16). Add `--spacing-gutter: 24px` for screen edge padding (`px-gutter`).

**Radius:** `sm 8`, `md 12`, `lg 16`, `xl 20`, `2xl 24`, `3xl 32`, plus `full` for pills (buttons, chips, fields, tab bar, icon buttons).

**Shadows** (`@utility`, `boxShadow`): `shadow-card` `0 1px 2px rgba(11,11,26,0.04), 0 4px 16px rgba(11,11,26,0.06)`; `shadow-raised` `0 8px 24px rgba(11,11,26,0.12)`; `shadow-floating` `0 12px 32px rgba(11,11,26,0.16)` (tab bar). All *est.*

**Motion** (`src/theme/motion.ts`): `fast 150`, `base 250`, `slow 400` ms.

## Out of scope

- Real screens, tab routes, and navigation wiring (the TabBar is built but not mounted as the app's navigator).
- A dark palette.
- The Home "featured" hero card and other screen-specific compositions.
- The Apple sign-in button (not on the sheet).

## Steps

### 1. Fonts, light mode, token foundation

- Copy the four Satoshi OTFs into `assets/fonts/`. Source: https://api.fontshare.com/v2/fonts/download/satoshi, folder `Fonts/OTF`.
- `src/app/_layout.tsx`: `useFonts({ "Satoshi-Regular": require(...), ... })`, keep the splash up until loaded, and keep `import "../global.css"` first and the `<Stack />`.
- `app.json`: set `userInterfaceStyle` to `"light"`.
- `src/global.css`: the tokens above in `@theme` + `:root`, plus `@utility` shadows. Keep the split Tailwind imports above them.
- `src/theme/colors.ts`, `src/theme/motion.ts`, `src/theme/index.ts`: the JS mirror.

Done when tsc passes and the Tailwind CLI output has `bg-primary`, `text-heading`, `rounded-2xl`, `font-sans-bold`, and `shadow-card`.

### 2. Foundation components (`src/components/ui/`)

- `text.tsx` `Text`: `variant` (the type table), `tone` (`ink` | `secondary` | `muted` | `inverse` | `violet` | `success` | `danger`), and `className`/`style` merged last.
- `wordmark.tsx` `Wordmark`: "roam" in the wordmark style, with a `size` prop (`md` 48, `sm` 28 for the auth header).
- `icons.ts`: a semantic registry (`home`, `search`, `heart`, `calendar`, `user`, `settings`, `pin`, `sliders`, `share`, `bookmark`, `chevron-right`, `chevron-left`, `arrow-right`, `arrow-up-right`, `star`, `paw`, `hot-tub`, `wifi`, `mountain`, `tree`, `wave`, `city`, `palm`, `list`, `map`, `lock`, `mail`, `eye-off`, `bell`, `help`, `card`, `suitcase`, `chat`, `document`, `check`, `x`, `alert`, `sparkles`, `minus`, `plus`). Each maps to `{ ios, android }` names. `icon.tsx` `Icon`: `name`, `size` (default 20), `color` (token key, default `ink`), `filled`.

### 3. Actions

- `button.tsx` `Button`: `variant` `primary` (yellow, ink text) | `secondary` (white, `line` border) | `ghost`; `size` `md` (48 high) | `lg` (56); `leading` node; `trailingIcon`; `loading`; `disabled`; full width by default; pressed state (primary → `primary-pressed`, others → opacity 0.7). Always `rounded-full`.
- `icon-button.tsx` `IconButton`: `variant` `gray` | `white` (on photos, with `shadow-card`) | `outline`; `size` `md` 48 | `lg` 56; `icon`, `filled`, and a required `accessibilityLabel`.
- `chip.tsx` `Chip`: `variant` `filter` (selected = `lavender`, bold label) | `category` (with icon; selected = `primary` with a filled icon); `selected`, `onPress`, `accessibilityState.selected`.
- `toggle.tsx` `Toggle`: RN `Switch` with `trackColor` `{ true: primary, false: line }` and a white thumb.
- `stepper.tsx` `Stepper`: an outlined pill with − value +; `value`, `min`, `max`, `onChange`; disables at the limits.
- `segmented-control.tsx` `SegmentedControl`: a `surface-gray` track with an `ink` pill on the selected segment (white text and icon); `options: {value, label, icon?}[]`, `value`, `onChange`; `accessibilityRole="tablist"`.

### 4. Inputs

`text-field.tsx` `TextField`: a `surface-gray` pill, 56 high; `leadingIcon`; optional stacked `label` (auth style); placeholder in `ink-muted`; focused state with a `lavender` border, `lavender-soft` background, and caret; `secure` with an eye/eye-off toggle; `trailing` node (e.g. the sliders icon for search); `error` text in `danger`. It forwards TextInput props.

### 5. Content

- `badge.tsx` `Badge`: `tone` `neutral` | `favorite` | `success` | `promo` | `info` | `accent`; optional `icon`; `size` `sm` (amenity tags) | `md`.
- `rating.tsx` `Rating`: a star plus value and `(count)` in `ink-secondary`.
- `price.tsx` `Price`: `$280` in the `title` style, then " / night" muted.
- `listing-card.tsx` `ListingCard`: image (expo-image, `rounded-2xl`, heart `IconButton` overlay), title, location (pin), `Rating`, up to two amenity `Badge`s, and `Price`; `onPress`, `favorite`, `onToggleFavorite`.
- `policy-card.tsx` `PolicyCard`: a `lavender-soft` `rounded-2xl` card with a white icon tile (`violet` icon), title, description, and a `violet` chevron; pressable.
- `list-group.tsx` `ListGroup` (optional title, `surface-gray` group with white inset rows) and `list-row.tsx` `ListRow` (icon tile, label, chevron, hairline divider inset under the label).
- `alert-banner.tsx` `AlertBanner`: `tone` `success` | `danger`, icon, message, `onDismiss` (X); `accessibilityRole="alert"`.

### 6. Tab bar

`tab-bar.tsx`: `TabBar` (a `GlassView` pill with `shadow-floating` and the fallback background) and `TabBarItem` (icon + label; focused = `primary` circle with a filled icon). `TabBarItem` accepts `TabTriggerSlotProps` so it works with `TabTrigger asChild` later.

### 7. Gallery

`src/app/design-system.tsx`, dev only (redirects to `/` when `!__DEV__`), titled "Design system". A scrolling page with the sheet's 15 sections in order, each using the real components with sample content from the sheet, and with interactive state (chips, toggle, stepper, segments, field focus, dismissible alerts). Add a temporary link from `index.tsx` in dev only.

## Verification

1. `npx tsc --noEmit`, `npx expo lint`, and `npx expo-doctor` pass.
2. Grep for drift: no hex colors or `fontSize` numbers in `src/components` or `src/app` outside `src/theme/` and `global.css`.
3. `npx expo export --platform ios` and `--platform web` build.
4. Web: start `npx expo start --web`, screenshot `/design-system` with headless Edge, and compare it section by section with `roam-design.png`. List every difference, fix it, and repeat. iOS simulator screenshots aren't possible on this Windows machine.
5. You: open the app in Expo Go on a phone, go to `/design-system` (dev link on the home screen), and check Satoshi renders (single-story "a" in "roam"), the icons, the filled active icons, the glass tab bar, and that inputs focus with the lavender ring.

## AGENTS.md updates

Under **Styling**, replace the `dark:` rule and add:
- Light only (`userInterfaceStyle: "light"`). Don't use `dark:` until a dark palette exists.
- Tokens live in `src/global.css` (`@theme` + `:root`, px values). `src/theme/` mirrors only what JS needs and must match. Never hardcode hex colors, font sizes, or off-scale spacing in screens or components.
- Font: Satoshi, one family per weight (`font-sans`, `font-sans-medium`, `-bold`, `-black`). Use the `Text` component, not raw `Text` with `font-bold`.
- Icons: `Icon` with names from `src/components/ui/icons.ts`. Add new icons to the registry with both iOS and Android names.
- Shared components live in `src/components/ui/`, and `/design-system` shows them all. Update the gallery when you add or change one.

## Result

Built as planned: tokens in `src/global.css`, a JS mirror in `src/theme/`, 19 components in `src/components/ui/`, and the `/design-system` gallery. tsc, lint, expo-doctor (20/20), the hardcoded-value grep, and the iOS and web exports all pass. The gallery was compared with the sheet in a 520px web screenshot.

Changes from the plan:
- The font tokens are `font-satoshi*`, not `font-sans*`, because `nativewind/theme` overrides `--font-sans` per platform.
- `display`, `heading`, and `wordmark` use Satoshi Black. The sheet labels them "Bold", but its samples render at Black weight.
- Text fields are `rounded-xl`, not pills, to match the sheet.
- `ListingCard` keeps its heart button as a sibling of the card's press target. Nested buttons are invalid HTML on web and broke hydration.
- On web the root layout doesn't wait for fonts, which also fixes a hydration mismatch.
- `TabBar` only checks Reduce Transparency on iOS, because react-native-web doesn't implement it.
- `Toggle` sets `activeThumbColor` on web.

Not checked: iOS and Android on a device, including liquid glass, SF Symbols, and the native switch. This Windows machine has no simulator. Assets still needed: the Google "G" mark and, if the wordmark is a custom logo, the logo file.

### Follow-up: native fixes from on-device review

The gallery looked sparse on an Android phone (SM-A176U, Expo Go), and sections seemed to be missing. Fixed by checking the phone over adb after each change:
- Fonts never loaded on native. NativeWind's `react-native` redirect drops `AssetRegistry` under RN 0.88, so expo-asset failed with `getAssetByID of undefined`. `metro.config.js` now gives expo-asset the real module on native.
- Line heights blew up on native (24px × font size), which pushed sections off-screen. The line-height tokens are now unitless ratios.
- The gallery now carries what the sheet shows: color usage notes and full-width swatches, type role and spec rows, captions on button, field, and chip variants, a 72pt wordmark (`wordmark-lg`), and tighter padding.
- `Text` gained a `weight` prop. The listing card photo is 112pt wide so the title and two amenity tags fit on a phone, and small badges use the label size.
