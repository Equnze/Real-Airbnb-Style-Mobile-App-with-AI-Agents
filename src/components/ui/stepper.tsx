import { Pressable, View } from "react-native";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

export type StepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Read by screen readers, e.g. "Guests". */
  accessibilityLabel: string;
  className?: string;
};

export function Stepper({ value, onChange, min = 0, max = Infinity, accessibilityLabel, className }: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ now: value, min, max: Number.isFinite(max) ? max : undefined }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "increment" && canIncrement) onChange(value + 1);
        if (event.nativeEvent.actionName === "decrement" && canDecrement) onChange(value - 1);
      }}
      className={`h-12 flex-row items-center self-start rounded-full border border-line bg-surface px-1 ${className ?? ""}`}
    >
      <StepButton icon="minus" disabled={!canDecrement} onPress={() => onChange(value - 1)} />
      <Text variant="title" className="min-w-8 text-center">
        {value}
      </Text>
      <StepButton icon="plus" disabled={!canIncrement} onPress={() => onChange(value + 1)} />
    </View>
  );
}

function StepButton({ icon, disabled, onPress }: { icon: IconName; disabled: boolean; onPress: () => void }) {
  return (
    <Pressable
      // The parent "adjustable" view carries the accessible controls.
      importantForAccessibility="no"
      accessibilityElementsHidden
      disabled={disabled}
      onPress={onPress}
      className={`h-10 w-10 items-center justify-center rounded-full ${disabled ? "opacity-30" : ""}`}
      style={({ pressed }) => (pressed ? { opacity: 0.5 } : null)}
    >
      <Icon name={icon} size={20} />
    </Pressable>
  );
}
