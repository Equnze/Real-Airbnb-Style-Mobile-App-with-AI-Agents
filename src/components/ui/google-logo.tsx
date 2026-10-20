import { View } from "react-native";

import { Text } from "./text";

// TODO(asset): placeholder. Replace with the official Google "G" mark in assets/images
// (brand assets must not be recreated by hand).
export function GoogleLogo() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no" className="h-6 w-6 items-center justify-center rounded-full border border-line">
      <Text variant="label" bold>
        G
      </Text>
    </View>
  );
}
