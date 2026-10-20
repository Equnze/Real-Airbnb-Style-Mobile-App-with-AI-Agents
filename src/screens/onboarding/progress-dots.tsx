import { View } from "react-native";

export function ProgressDots({ count, index }: { count: number; index: number }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${index + 1} of ${count}`}
      accessibilityValue={{ min: 1, max: count, now: index + 1 }}
      className="flex-row gap-2"
    >
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className={`h-1.5 w-8 rounded-full ${i === index ? "bg-lavender" : "bg-line"}`} />
      ))}
    </View>
  );
}
