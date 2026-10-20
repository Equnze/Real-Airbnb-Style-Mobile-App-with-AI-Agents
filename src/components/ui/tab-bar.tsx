import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import type { TabTriggerSlotProps } from "expo-router/ui";
import { useEffect, useState, type ReactNode } from "react";
import { AccessibilityInfo, Platform, Pressable, View } from "react-native";

import { colors } from "@/theme";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

function useLiquidGlass() {
  const [reduceTransparency, setReduceTransparency] = useState(false);
  useEffect(() => {
    // Liquid glass is iOS-only, and react-native-web has no isReduceTransparencyEnabled.
    if (Platform.OS !== "ios") return;
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);
    const sub = AccessibilityInfo.addEventListener("reduceTransparencyChanged", setReduceTransparency);
    return () => sub.remove();
  }, []);
  return isLiquidGlassAvailable() && isGlassEffectAPIAvailable() && !reduceTransparency;
}

// Liquid glass on iOS 26+, translucent white elsewhere. Drop into expo-router/ui TabList.
export function TabBar({ children, className }: { children: ReactNode; className?: string }) {
  const glass = useLiquidGlass();
  return (
    <View className={`rounded-full shadow-floating ${className ?? ""}`}>
      <GlassView
        glassEffectStyle="regular"
        // Pill shape for the glass itself; GlassView isn't a NativeWind component.
        style={{ borderRadius: 9999, backgroundColor: glass ? undefined : colors.glassFallback }}
      >
        <View accessibilityRole="tablist" className="flex-row items-center p-1.5">
          {children}
        </View>
      </GlassView>
    </View>
  );
}

// expo-router's slot ref type doesn't match RN 0.88's View ref; the item doesn't need it typed.
export type TabBarItemProps = Omit<TabTriggerSlotProps, "ref"> & {
  icon: IconName;
  label: string;
};

// Works standalone or as the child of <TabTrigger asChild>, which passes isFocused.
export function TabBarItem({ icon, label, isFocused = false, ...props }: TabBarItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      className="flex-1 items-center"
      {...props}
    >
      <View className={`h-18 w-18 items-center justify-center gap-1 rounded-full ${isFocused ? "bg-primary" : ""}`}>
        <Icon name={icon} size={24} filled={isFocused} />
        <Text variant="label">{label}</Text>
      </View>
    </Pressable>
  );
}
