import { useState } from "react";
import { Platform, TextInput, View } from "react-native";

import { Text } from "./text";

export type CodeFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  /** Called once every box is filled. */
  onComplete?: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
  className?: string;
};

// One-time code boxes. A single transparent input lies over the boxes, so paste and
// OS code autofill fill every box at once.
export function CodeField({ value, onChangeText, length = 6, onComplete, error, autoFocus, className }: CodeFieldProps) {
  const [focused, setFocused] = useState(false);

  const change = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, length);
    onChangeText(digits);
    if (digits.length === length && digits !== value) onComplete?.(digits);
  };

  return (
    <View className={className}>
      <View className="flex-row gap-2">
        {Array.from({ length }, (_, index) => {
          const active = focused && index === Math.min(value.length, length - 1);
          const state = error
            ? "border-danger bg-surface-gray"
            : active
              ? "border-lavender bg-lavender-soft"
              : "border-transparent bg-surface-gray";
          return (
            <View key={index} className={`h-14 flex-1 items-center justify-center rounded-xl border-2 ${state}`}>
              <Text variant="title">{value[index] ?? ""}</Text>
            </View>
          );
        })}
        <TextInput
          value={value}
          onChangeText={change}
          maxLength={length}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          autoFocus={autoFocus}
          caretHidden
          accessibilityLabel="Verification code"
          selectionColor="transparent"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // Invisible but still focusable; transparent text color still drew on Android.
          className="absolute inset-0 opacity-0"
        />
      </View>
      {error ? (
        <Text variant="caption" tone="danger" className="mt-1 px-5">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
