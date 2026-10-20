import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import "../global.css";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.local.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Keyed by PostScript name so the same family name works on iOS, Android, and web.
  const [loaded, error] = useFonts({
    "Satoshi-Regular": require("@/assets/fonts/Satoshi-Regular.otf"),
    "Satoshi-Medium": require("@/assets/fonts/Satoshi-Medium.otf"),
    "Satoshi-Bold": require("@/assets/fonts/Satoshi-Bold.otf"),
    "Satoshi-Black": require("@/assets/fonts/Satoshi-Black.otf"),
  });

  useEffect(() => {
    if (error) console.warn("Fonts failed to load", error);
  }, [error]);

  // Web is server-rendered with the fonts as @font-face rules, so it must render the same
  // tree on the client's first pass; holding it back there breaks hydration.
  const fontsReady = loaded || !!error || Platform.OS === "web";

  // tokenCache keeps the session in SecureStore, so users stay signed in across restarts.
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <RootStack fontsReady={fontsReady} />
    </ClerkProvider>
  );
}

function RootStack({ fontsReady }: { fontsReady: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const ready = fontsReady && isLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Wait for Clerk to restore the session so a signed-in launch never flashes onboarding.
  // The server and the client's first pass both render nothing here, so web still hydrates.
  if (!ready) return null;

  // Screens draw their own chrome; the dev gallery opts back into a header.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      {/* Signing out (or opening /home signed out) lands on sign-in. */}
      <Stack.Protected guard={!!isSignedIn} redirectTo="/sign-in">
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
}
