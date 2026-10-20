import { Text as RNText, type TextProps as RNTextProps } from "react-native";

// The sheet labels display/heading "Bold", but its samples render at Satoshi Black weight.
const variants = {
  display: "font-satoshi-black text-display",
  hero: "font-satoshi-black text-hero", // screen titles (onboarding, auth)
  heading: "font-satoshi-black text-heading",
  title: "font-satoshi-bold text-title",
  body: "font-satoshi text-body",
  caption: "font-satoshi-medium text-caption",
  label: "font-satoshi-medium text-label",
  button: "font-satoshi-medium text-button",
  wordmark: "font-satoshi-black text-wordmark",
} as const;

const tones = {
  ink: "text-ink",
  secondary: "text-ink-secondary",
  muted: "text-ink-muted",
  inverse: "text-surface",
  violet: "text-violet",
  success: "text-success",
  danger: "text-danger",
  info: "text-info",
  promo: "text-promo",
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

const weights = {
  regular: "font-satoshi",
  medium: "font-satoshi-medium",
  bold: "font-satoshi-bold",
  black: "font-satoshi-black",
} as const;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  /** Swap the variant's face, keeping its size (e.g. a regular-weight title). */
  weight?: keyof typeof weights;
  /** Shorthand for weight="bold". */
  bold?: boolean;
};

export function Text({ variant = "body", tone = "ink", weight, bold, className, ...props }: TextProps) {
  const face = weight ?? (bold ? "bold" : undefined);
  const base = face ? variants[variant].replace(/font-satoshi(-\w+)?/, weights[face]) : variants[variant];
  return <RNText className={`${base} ${tones[tone]} ${className ?? ""}`} {...props} />;
}
