import { View } from "react-native";

import { Text } from "@/components/ui/text";

export function OrDivider({ className }: { className?: string }) {
  return (
    <View className={`flex-row items-center gap-4 ${className ?? ""}`}>
      <View className="h-px flex-1 bg-line" />
      <Text variant="caption" tone="muted">
        or
      </Text>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
