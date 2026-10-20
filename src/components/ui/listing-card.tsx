import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { colors } from "@/theme";

import { Badge } from "./badge";
import { Icon } from "./icon";
import { IconButton } from "./icon-button";
import type { IconName } from "./icons";
import { Price } from "./price";
import { Rating } from "./rating";
import { Text } from "./text";

export type ListingCardProps = {
  title: string;
  location: string;
  imageUri: string;
  rating: number;
  reviewCount: number;
  price: number;
  amenities?: { icon: IconName; label: string }[];
  favorite?: boolean;
  onToggleFavorite?: () => void;
  onPress?: () => void;
  className?: string;
};

export function ListingCard({
  title,
  location,
  imageUri,
  rating,
  reviewCount,
  price,
  amenities = [],
  favorite = false,
  onToggleFavorite,
  onPress,
  className,
}: ListingCardProps) {
  return (
    <View className={`rounded-3xl bg-surface shadow-card ${className ?? ""}`}>
      {/* Visual content; the press target below carries the accessible summary. */}
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="flex-row gap-3 p-2">
        {/* expo-image isn't a NativeWind component, so the wrapper sizes and clips it. */}
        <View className="h-36 w-28 overflow-hidden rounded-2xl corner-squircle">
          <Image source={{ uri: imageUri }} contentFit="cover" style={{ flex: 1 }} />
        </View>
        <View className="flex-1 justify-center gap-1.5 py-1 pr-2">
          <Text variant="title" numberOfLines={2}>
            {title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon name="pin" size={16} color="inkMuted" />
            <Text tone="secondary" numberOfLines={1}>
              {location}
            </Text>
          </View>
          <Rating value={rating} count={reviewCount} />
          {amenities.length > 0 ? (
            <View className="flex-row flex-wrap gap-1.5">
              {amenities.slice(0, 2).map((amenity) => (
                <Badge key={amenity.label} size="sm" icon={amenity.icon} label={amenity.label} />
              ))}
            </View>
          ) : null}
          <Price amount={price} />
        </View>
      </View>
      {/* The press target and the heart are siblings: nested buttons are invalid HTML on web. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${location}, rated ${rating}, $${price} per night`}
        onPress={onPress}
        className="absolute inset-0 rounded-3xl"
        style={({ pressed }) => (pressed ? { backgroundColor: colors.pressOverlay } : null)}
      />
      {onToggleFavorite ? (
        <IconButton
          icon="heart"
          filled={favorite}
          variant="white"
          size="sm"
          accessibilityLabel={favorite ? "Remove from saved" : "Save stay"}
          accessibilityState={{ selected: favorite }}
          onPress={onToggleFavorite}
          // Top-right of the photo: 8px card padding + 112px photo - 8px inset - 40px button.
          className="absolute left-18 top-4"
        />
      ) : null}
    </View>
  );
}
