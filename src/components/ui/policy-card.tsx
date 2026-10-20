import { Pressable, View, type PressableProps } from "react-native";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

export type PolicyCardProps = Omit<PressableProps, "children" | "style"> & {
  icon: IconName;
  title: string;
  description: string;
  className?: string;
};

export function PolicyCard({ icon, title, description, className, ...props }: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      className={`flex-row items-center gap-4 rounded-2xl bg-lavender-soft p-4 corner-squircle ${className ?? ""}`}
      style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
      {...props}
    >
      <View className="h-12 w-12 items-center justify-center rounded-lg bg-surface corner-squircle">
        <Icon name={icon} size={24} color="violet" />
      </View>
      <View className="flex-1 gap-0.5">
        <Text variant="body" bold>
          {title}
        </Text>
        <Text variant="caption" tone="secondary">
          {description}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color="violet" />
    </Pressable>
  );
}
