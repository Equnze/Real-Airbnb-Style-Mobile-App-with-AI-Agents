import { Pressable, type PressableProps } from "react-native";

import type { ColorToken } from "@/theme";

import { Icon } from "./icon";
import type { IconName } from "./icons";

const variants = {
  gray: "bg-surface-gray",
  white: "bg-surface shadow-card", // on photos
  outline: "bg-surface border border-line",
} as const;

const sizes = {
  sm: { container: "h-10 w-10", icon: 18 },
  md: { container: "h-12 w-12", icon: 22 },
  lg: { container: "h-14 w-14", icon: 24 },
} as const;

export type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon: IconName;
  accessibilityLabel: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  filled?: boolean;
  color?: ColorToken;
  className?: string;
};

export function IconButton({
  icon,
  variant = "gray",
  size = "md",
  filled,
  color = "ink",
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={`items-center justify-center rounded-full ${variants[variant]} ${sizes[size].container} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
      {...props}
    >
      <Icon name={icon} size={sizes[size].icon} filled={filled} color={color} />
    </Pressable>
  );
}
