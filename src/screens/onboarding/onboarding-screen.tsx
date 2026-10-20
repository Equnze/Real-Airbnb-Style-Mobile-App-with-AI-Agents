import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FlatList, Platform, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google-logo";
import { Text } from "@/components/ui/text";
import { Wordmark } from "@/components/ui/wordmark";

import { LocationPill } from "./location-pill";
import { ProgressDots } from "./progress-dots";
import { SHEET_EDGE_BASE, SheetEdge } from "./sheet-edge";
import { slides, type Slide } from "./slides";

const goToSignUp = () => router.push("/sign-up");

// False while server rendering and hydrating, true after.
const subscribeNoop = () => () => {};
const useHydrated = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export function OnboardingScreen() {
  const windowSize = useWindowDimensions();
  // Pages fill the screen's real area. On Android edge-to-edge that's taller than the window
  // height, which leaves out the navigation bar.
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(null);
  const size = layout ?? windowSize;
  // Web is server-rendered at 0×0 and React won't patch those sizes during hydration, so the
  // size-dependent pager renders only after mount there. Native renders it immediately.
  const hydrated = useHydrated();
  const ready = Platform.OS !== "web" || hydrated;
  const pager = useRef<FlatList<Slide>>(null);

  useEffect(() => {
    Image.prefetch(slides.map((slide) => slide.imageUri));
  }, []);

  const next = (index: number) => {
    if (index < slides.length - 1) pager.current?.scrollToIndex({ index: index + 1 });
    else goToSignUp();
  };

  return (
    <View className="flex-1 bg-ink" onLayout={(event) => setLayout(event.nativeEvent.layout)}>
      <StatusBar style="dark" />
      {ready ? (
        <FlatList
          ref={pager}
          data={slides}
          keyExtractor={(slide) => slide.key}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({ length: size.width, offset: size.width * index, index })}
          renderItem={({ item, index }) => (
            <SlidePage slide={item} index={index} width={size.width} height={size.height} onNext={() => next(index)} />
          )}
        />
      ) : null}
      <TopBar />
    </View>
  );
}

function TopBar() {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 flex-row items-center justify-between px-gutter"
      style={{ paddingTop: insets.top + 12 }}
    >
      <Wordmark />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
        onPress={goToSignUp}
        className="h-11 items-center justify-center rounded-full bg-glass px-5"
        style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
      >
        <Text variant="caption">Skip</Text>
      </Pressable>
    </View>
  );
}

type SlidePageProps = { slide: Slide; index: number; width: number; height: number; onNext: () => void };

function SlidePage({ slide, index, width, height, onNext }: SlidePageProps) {
  const insets = useSafeAreaInsets();
  const edgeHeight = (SHEET_EDGE_BASE.height * width) / SHEET_EDGE_BASE.width;

  return (
    <View style={{ width, height }}>
      <Image source={{ uri: slide.imageUri }} contentFit="cover" transition={200} style={StyleSheet.absoluteFill} />

      <View className="absolute inset-x-0 bottom-0">
        <LocationPill label={slide.location} className="mb-3 ml-gutter" />

        <View>
          <View className="absolute inset-x-0 top-0">
            <SheetEdge width={width} />
          </View>
          {/* White body under the curved edge; overlaps it by 1pt so no seam shows. */}
          <View className="absolute inset-x-0 bottom-0 bg-surface" style={{ top: edgeHeight - 1 }} />

          <View className="px-gutter pt-8" style={{ paddingBottom: insets.bottom + 16 }}>
            <View className="px-1.5">
              <ProgressDots count={slides.length} index={index} />
              <Text variant="hero" accessibilityRole="header" className="mt-6">
                {slide.title}
              </Text>
              <Text tone="secondary" className="mt-3">
                {slide.body}
              </Text>
            </View>
            <View className="mt-4 gap-3">
              <Button title="Get started" size="md" trailingIcon="arrow-right" onPress={onNext} />
              <Button
                title="Continue with Google"
                variant="secondary"
                size="md"
                leading={<GoogleLogo />}
                // TODO(clerk): start Google OAuth instead of opening sign-up.
                onPress={goToSignUp}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
