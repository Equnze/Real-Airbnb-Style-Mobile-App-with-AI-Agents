import { View } from "react-native";

import { Icon } from "./icon";
import { Text } from "./text";

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  const label = count === undefined ? `Rated ${value}` : `Rated ${value} from ${count} reviews`;
  return (
    <View accessible accessibilityLabel={label} className={`flex-row items-center gap-1.5 ${className ?? ""}`}>
      <Icon name="star" size={18} color="star" filled />
      <Text variant="body">{value.toFixed(1)}</Text>
      {count === undefined ? null : <Text tone="secondary">({count})</Text>}
    </View>
  );
}
