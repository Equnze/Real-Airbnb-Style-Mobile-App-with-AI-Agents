import { router } from "expo-router";
import { View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Wordmark } from "@/components/ui/wordmark";

// Back button and small wordmark, shared by the auth screens.
export function AuthHeader() {
  const back = () => (router.canGoBack() ? router.back() : router.replace("/onboarding"));
  return (
    <View className="flex-row items-center justify-between">
      <IconButton icon="chevron-left" variant="outline" accessibilityLabel="Back" onPress={back} />
      <Wordmark size="sm" />
    </View>
  );
}
