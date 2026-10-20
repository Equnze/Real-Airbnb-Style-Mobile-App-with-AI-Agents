import { View } from "react-native";

import { Text } from "./text";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function Price({ amount, unit = "night", className }: { amount: number; unit?: string; className?: string }) {
  const formatted = currency.format(amount);
  return (
    <View accessible accessibilityLabel={`${formatted} per ${unit}`} className={`flex-row items-baseline gap-1 ${className ?? ""}`}>
      <Text variant="title">{formatted}</Text>
      <Text tone="muted">/ {unit}</Text>
    </View>
  );
}
