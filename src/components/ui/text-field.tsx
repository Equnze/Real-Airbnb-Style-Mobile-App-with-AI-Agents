import { useState, type ReactNode, type Ref } from "react";
import { Pressable, TextInput, View, type TextInputInstance, type TextInputProps } from "react-native";

import { colors } from "@/theme";

import { Icon } from "./icon";
import type { IconName } from "./icons";
import { Text } from "./text";

export type TextFieldProps = Omit<TextInputProps, "style" | "placeholderTextColor"> & {
  leadingIcon?: IconName;
  /** Stacked label inside the field (auth forms). */
  label?: string;
  /** Hides the value and adds a show/hide toggle. */
  secure?: boolean;
  /** Trailing control, e.g. the filters button on search. */
  trailing?: ReactNode;
  error?: string;
  className?: string;
  /** Forwarded to the input, e.g. to move focus to the next field. */
  ref?: Ref<TextInputInstance>;
};

export function TextField({
  leadingIcon,
  label,
  secure = false,
  trailing,
  error,
  className,
  ref,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const state = error
    ? "border-danger bg-surface-gray"
    : focused
      ? "border-lavender bg-lavender-soft"
      : "border-transparent bg-surface-gray";

  return (
    <View className={className}>
      <View className={`flex-row items-center gap-3 rounded-xl border-2 px-5 ${label ? "h-17" : "h-14"} ${state}`}>
        {leadingIcon ? <Icon name={leadingIcon} size={22} /> : null}
        <View className="flex-1">
          {label ? <Text variant="caption">{label}</Text> : null}
          <TextInput
            ref={ref}
            accessibilityLabel={label ?? props.placeholder}
            placeholderTextColor={colors.inkMuted}
            selectionColor={colors.violet}
            cursorColor={colors.violet}
            secureTextEntry={secure && hidden}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            className="p-0 font-satoshi text-body text-ink"
            {...props}
          />
        </View>
        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={8}
            onPress={() => setHidden((value) => !value)}
          >
            <Icon name={hidden ? "eye-off" : "eye"} size={22} />
          </Pressable>
        ) : null}
        {trailing}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" className="mt-1 px-5">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
