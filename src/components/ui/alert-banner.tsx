import { Pressable, View } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

const tones = {
  success: { container: "bg-success-soft", color: "success", icon: "check" },
  danger: { container: "bg-danger-soft", color: "danger", icon: "alert" },
} as const;

export type AlertBannerProps = {
  tone: keyof typeof tones;
  message: string;
  onDismiss?: () => void;
  className?: string;
};

export function AlertBanner({ tone, message, onDismiss, className }: AlertBannerProps) {
  const { container, color, icon } = tones[tone];
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={`min-h-14 flex-row items-center gap-3 rounded-xl px-4 py-3 corner-squircle ${container} ${className ?? ""}`}
    >
      <Icon name={icon} size={24} color={color} />
      <Text variant="caption" tone={color} className="flex-1">
        {message}
      </Text>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={8} onPress={onDismiss}>
          <Icon name="x" size={20} color={color} />
        </Pressable>
      ) : null}
    </View>
  );
}
