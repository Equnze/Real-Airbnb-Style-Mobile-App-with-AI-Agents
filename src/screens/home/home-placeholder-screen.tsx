import { useClerk, useUser } from "@clerk/expo";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Wordmark } from "@/components/ui/wordmark";

// TODO(home): placeholder signed-in screen until the home design lands.
export function HomePlaceholderScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const firstName = user?.firstName;

  // Signing out flips the root guard, which sends this screen to sign-in.
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View className="flex-1 bg-surface px-gutter" style={{ paddingTop: insets.top + 8 }}>
      <StatusBar style="dark" />
      <Wordmark size="sm" />
      <Text variant="hero" accessibilityRole="header" className="mt-8">
        {firstName ? `Welcome,\n${firstName}` : "Welcome\nback"}
      </Text>
      <Text tone="muted" className="mt-3">
        You&apos;re signed in as {user?.primaryEmailAddress?.emailAddress}. Home arrives with its design.
      </Text>
      <Button
        title="Sign out"
        variant="secondary"
        size="md"
        loading={signingOut}
        onPress={handleSignOut}
        className="mt-6"
      />
    </View>
  );
}
