import { MaterialSymbols_400Regular_Filled } from "@expo-google-fonts/material-symbols/400Regular_Filled";
import { SymbolView } from "expo-symbols";
import { Platform, type StyleProp, type ViewStyle } from "react-native";

import { colors, type ColorToken } from "@/theme";

import { icons, type IconName, type IconSpec } from "./icons";

const filledFace = { name: "MaterialSymbols_400Regular_Filled", font: MaterialSymbols_400Regular_Filled };

export type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorToken;
  filled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 20, color = "ink", filled = false, style }: IconProps) {
  const spec: IconSpec = icons[name];
  const ios = (filled && spec.iosFilled) || spec.ios;
  if (Platform.OS !== "ios" && !spec.android) return null;
  return (
    <SymbolView
      // SymbolView loads its Android/web font once on mount, so remount when the face changes.
      key={filled ? "filled" : "outline"}
      name={{ ios, android: spec.android, web: spec.android }}
      weight={filled ? { ios: "regular", android: filledFace } : undefined}
      size={size}
      tintColor={colors[color]}
      style={style}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
