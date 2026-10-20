import { View } from "react-native";

import type { ColorToken } from "@/theme";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text, type TextTone } from "./text";

const tones = {
  neutral: { container: "bg-surface-gray", text: "ink", icon: "ink" }, // amenity tags
  favorite: { container: "bg-favorite-soft", text: "ink", icon: "star" },
  success: { container: "bg-success-soft", text: "success", icon: "success" },
  promo: { container: "bg-promo-soft", text: "promo", icon: "promo" },
  info: { container: "bg-info-soft", text: "info", icon: "info" },
  accent: { container: "bg-lavender-soft", text: "ink", icon: "star" },
} as const satisfies Record<string, { container: string; text: TextTone; icon: ColorToken }>;

const sizes = {
  sm: { container: "h-7 px-2 gap-1", text: "label", icon: 13 },
  md: { container: "h-11 px-5 gap-2", text: "body", icon: 20 },
} as const;

export type BadgeProps = {
  label: string;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  icon?: IconName;
  /** Filled icon, e.g. the star on "Guest favorite". */
  iconFilled?: boolean;
  className?: string;
};

export function Badge({ label, tone = "neutral", size = "md", icon, iconFilled, className }: BadgeProps) {
  return (
    <View className={`flex-row items-center self-start rounded-full ${tones[tone].container} ${sizes[size].container} ${className ?? ""}`}>
      {icon ? <Icon name={icon} size={sizes[size].icon} color={tones[tone].icon} filled={iconFilled} /> : null}
      <Text variant={sizes[size].text} tone={tones[tone].text}>
        {label}
      </Text>
    </View>
  );
}
