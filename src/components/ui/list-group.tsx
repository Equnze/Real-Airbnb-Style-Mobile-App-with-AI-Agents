import { Children, Fragment, type ReactNode } from "react";
import { Pressable, View, type PressableProps } from "react-native";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

export function ListGroup({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  const rows = Children.toArray(children);
  return (
    <View className={`gap-3 rounded-3xl bg-surface-gray p-2 corner-squircle ${className ?? ""}`}>
      {title ? (
        <Text variant="title" accessibilityRole="header" className="px-3 pt-3">
          {title}
        </Text>
      ) : null}
      <View className="rounded-2xl bg-surface py-1 corner-squircle">
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 ? <View className="ml-17 mr-4 h-px bg-line" /> : null}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

export type ListRowProps = Omit<PressableProps, "children" | "style"> & {
  icon: IconName;
  label: string;
  className?: string;
};

export function ListRow({ icon, label, className, ...props }: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`h-14 flex-row items-center gap-4 px-3 ${className ?? ""}`}
      style={({ pressed }) => (pressed ? { opacity: 0.6 } : null)}
      {...props}
    >
      <View className="h-10 w-10 items-center justify-center rounded-md bg-surface-gray corner-squircle">
        <Icon name={icon} size={22} />
      </View>
      <Text className="flex-1">{label}</Text>
      <Icon name="chevron-right" size={18} />
    </Pressable>
  );
}
