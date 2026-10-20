import type { AndroidSymbol, SFSymbol } from "expo-symbols";

export type IconSpec = {
  ios: SFSymbol;
  /** SF Symbol for the filled/active state, when it differs. */
  iosFilled?: SFSymbol;
  /** Material Symbol, used on Android and web. Filled uses the Filled font face. Omit for iOS-only marks. */
  android?: AndroidSymbol;
};

// Semantic icon names. Add new icons here with both platform names.
export const icons = {
  home: { ios: "house", iosFilled: "house.fill", android: "home" },
  search: { ios: "magnifyingglass", android: "search" },
  heart: { ios: "heart", iosFilled: "heart.fill", android: "favorite" },
  calendar: { ios: "calendar", android: "calendar_today" },
  user: { ios: "person", iosFilled: "person.fill", android: "person" },
  settings: { ios: "gearshape", iosFilled: "gearshape.fill", android: "settings" },
  pin: { ios: "mappin.and.ellipse", iosFilled: "mappin", android: "location_on" },
  sliders: { ios: "slider.horizontal.3", android: "tune" },
  share: { ios: "square.and.arrow.up", android: "ios_share" },
  bookmark: { ios: "bookmark", iosFilled: "bookmark.fill", android: "bookmark" },
  "chevron-right": { ios: "chevron.right", android: "chevron_right" },
  "chevron-left": { ios: "chevron.left", android: "chevron_left" },
  "arrow-right": { ios: "arrow.right", android: "arrow_forward" },
  "arrow-up-right": { ios: "arrow.up.right", android: "arrow_outward" },
  star: { ios: "star", iosFilled: "star.fill", android: "star" },
  paw: { ios: "pawprint", iosFilled: "pawprint.fill", android: "pets" },
  "hot-tub": { ios: "bathtub", iosFilled: "bathtub.fill", android: "hot_tub" },
  wifi: { ios: "wifi", android: "wifi" },
  mountain: { ios: "mountain.2", iosFilled: "mountain.2.fill", android: "landscape" },
  tree: { ios: "tree", iosFilled: "tree.fill", android: "forest" },
  wave: { ios: "water.waves", android: "waves" },
  city: { ios: "building.2", iosFilled: "building.2.fill", android: "apartment" },
  palm: { ios: "beach.umbrella", iosFilled: "beach.umbrella.fill", android: "beach_access" },
  list: { ios: "list.bullet", android: "list" },
  map: { ios: "map", iosFilled: "map.fill", android: "map" },
  lock: { ios: "lock", iosFilled: "lock.fill", android: "lock" },
  mail: { ios: "envelope", iosFilled: "envelope.fill", android: "mail" },
  eye: { ios: "eye", android: "visibility" },
  "eye-off": { ios: "eye.slash", android: "visibility_off" },
  bell: { ios: "bell", iosFilled: "bell.fill", android: "notifications" },
  help: { ios: "questionmark.circle", android: "help" },
  card: { ios: "creditcard", iosFilled: "creditcard.fill", android: "credit_card" },
  suitcase: { ios: "suitcase", iosFilled: "suitcase.fill", android: "luggage" },
  chat: { ios: "bubble.left", iosFilled: "bubble.left.fill", android: "chat" },
  document: { ios: "doc.text", iosFilled: "doc.text.fill", android: "description" },
  check: { ios: "checkmark.circle.fill", android: "check_circle" },
  x: { ios: "xmark", android: "close" },
  alert: { ios: "exclamationmark.circle.fill", android: "error" },
  sparkles: { ios: "sparkles", android: "auto_awesome" },
  minus: { ios: "minus", android: "remove" },
  plus: { ios: "plus", android: "add" },
  apple: { ios: "apple.logo" }, // brand mark; iOS only (Material Symbols has none)
} satisfies Record<string, IconSpec>;

export type IconName = keyof typeof icons;
