import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

// Dark frosted pill naming the photo's place, sitting on the photo above the sheet.
export function LocationPill({ label, className }: { label: string; className?: string }) {
  return (
    <View
      accessible
      accessibilityLabel={`Photo location: ${label}`}
      className={`h-10 flex-row items-center gap-2 self-start rounded-full border border-glass-line bg-overlay px-4 ${className ?? ""}`}
    >
      <Icon name="pin" size={16} color="surface" filled />
      <Text variant="caption" tone="inverse">
        {label}
      </Text>
    </View>
  );
}
