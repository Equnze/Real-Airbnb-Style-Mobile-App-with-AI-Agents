import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View, type PressableProps } from "react-native";

import { colors } from "@/theme";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

const variants = {
  primary: { container: "bg-primary", pressed: { backgroundColor: colors.primaryPressed } },
  secondary: { container: "bg-surface border border-line", pressed: { opacity: 0.7 } },
  ghost: { container: "bg-transparent", pressed: { opacity: 0.7 } },
} as const;

const sizes = {
  md: "h-12 px-6",
  lg: "h-14 px-6",
} as const;

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Brand mark before the title, e.g. the Google logo. */
  leading?: ReactNode;
  /** Icon pinned to the trailing edge, e.g. arrow-right. */
  trailingIcon?: IconName;
  loading?: boolean;
  className?: string;
};

export function Button({
  title,
  variant = "primary",
  size = "lg",
  leading,
  trailingIcon,
  loading = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: loading }}
      disabled={inactive}
      className={`flex-row items-center justify-center rounded-full ${variants[variant].container} ${sizes[size]} ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      style={({ pressed }) => (pressed ? variants[variant].pressed : null)}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          {leading ? <View className="mr-3">{leading}</View> : null}
          <Text variant="button" bold={variant === "primary"}>
            {title}
          </Text>
          {trailingIcon ? (
            <View className="absolute right-6">
              <Icon name={trailingIcon} size={22} />
            </View>
          ) : null}
        </>
      )}
    </Pressable>
  );
}
