import { Platform, Switch, type SwitchProps } from "react-native";

import { colors } from "@/theme";

// react-native-web ignores thumbColor while on and falls back to its own teal; it reads activeThumbColor.
const webProps = Platform.OS === "web" ? ({ activeThumbColor: colors.surface } as object) : {};

// The platform switch is the design; this only applies the brand track colors.
export function Toggle(props: Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor">) {
  return (
    <Switch
      trackColor={{ false: colors.line, true: colors.primary }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.line}
      {...webProps}
      {...props}
    />
  );
}
