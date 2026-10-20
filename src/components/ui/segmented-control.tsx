import { Pressable, View } from "react-native";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

export type SegmentOption<T extends string> = { value: T; label: string; icon?: IconName };

export type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedControl<T extends string>({ options, value, onChange, className }: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" className={`flex-row rounded-full bg-surface-gray p-1 ${className ?? ""}`}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={`h-11 flex-1 flex-row items-center justify-center gap-2 rounded-full px-5 ${selected ? "bg-ink" : ""}`}
          >
            {option.icon ? <Icon name={option.icon} size={18} color={selected ? "surface" : "ink"} /> : null}
            <Text variant="caption" tone={selected ? "inverse" : "ink"}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
