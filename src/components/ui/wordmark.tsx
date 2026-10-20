import { Text } from "./text";

const sizes = {
  lg: "text-wordmark-lg", // brand moments (design sheet, onboarding)
  md: "",
  sm: "text-wordmark-sm", // auth header
} as const;

export function Wordmark({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) {
  return (
    <Text variant="wordmark" accessibilityRole="header" accessibilityLabel="Roam" className={`${sizes[size]} ${className ?? ""}`}>
      roam
    </Text>
  );
}
