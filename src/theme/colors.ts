// Mirrors the --color-* tokens in src/global.css for props that need a JS value
// (SymbolView tintColor, Switch trackColor, placeholderTextColor). Keep in sync.
export const colors = {
  primary: "#FFC629",
  primaryPressed: "#F2B200",
  lavender: "#C9B4FF",
  lavenderSoft: "#F0ECFF",
  violet: "#5F31F8",
  ink: "#0B0B1A",
  inkSecondary: "#6B7280",
  inkMuted: "#A0A4AE",
  surface: "#FFFFFF",
  surfaceGray: "#F4F5F7",
  line: "#E5E7EB",
  // Tab bar background where liquid glass isn't available (Android, web, iOS < 26, Reduce Transparency).
  glassFallback: "rgba(255, 255, 255, 0.85)",
  // Pressed tint over cards whose content can't change opacity (ink at 4%).
  pressOverlay: "rgba(11, 11, 26, 0.04)",
  star: "#FDB805",
  success: "#0E7A4A",
  danger: "#DD3A4D",
  info: "#2C4FB2",
  promo: "#D6336C",
} as const;

export type ColorToken = keyof typeof colors;
