import { Pressable, type PressableProps } from "react-native";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

const variants = {
  // Search refinements ("Cabins", "Under $300"): lavender when selected.
  filter: { selected: "bg-lavender", idle: "bg-surface-gray" },
  // Stay categories with an icon ("All Stays", "Beach"): yellow when selected.
  category: { selected: "bg-primary", idle: "bg-surface-gray" },
} as const;

export type ChipProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  variant?: keyof typeof variants;
  icon?: IconName;
  selected?: boolean;
  className?: string;
};

export function Chip({ label, variant = "filter", icon, selected = false, className, ...props }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`h-11 flex-row items-center gap-2 rounded-full px-5 ${selected ? variants[variant].selected : variants[variant].idle} ${className ?? ""}`}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
      {...props}
    >
      {icon ? <Icon name={icon} size={20} filled={selected} /> : null}
      <Text variant="body" bold={selected}>
        {label}
      </Text>
    </Pressable>
  );
}
