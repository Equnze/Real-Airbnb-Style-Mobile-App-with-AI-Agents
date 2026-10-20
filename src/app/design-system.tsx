import { Redirect, Stack } from "expo-router";
import { useState, type ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { CodeField } from "@/components/ui/code-field";
import { GoogleLogo } from "@/components/ui/google-logo";
import { Icon } from "@/components/ui/icon";
import { IconButton } from "@/components/ui/icon-button";
import type { IconName } from "@/components/ui/icons";
import { ListGroup, ListRow } from "@/components/ui/list-group";
import { ListingCard } from "@/components/ui/listing-card";
import { PolicyCard } from "@/components/ui/policy-card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { TabBar, TabBarItem } from "@/components/ui/tab-bar";
import { Text, type TextVariant } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { Toggle } from "@/components/ui/toggle";
import { Wordmark } from "@/components/ui/wordmark";

// Dev-only gallery of every design-system component, in the order of assets/images/roam-design.png.
export default function DesignSystemRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <DesignSystemGallery />;
}

// Literal class names so Tailwind generates them. Hex values are documentation.
const swatches = [
  { className: "bg-primary", name: "Primary Yellow", value: "#FFC629", use: "Primary actions, active states" },
  { className: "bg-lavender", name: "Lavender", value: "#C9B4FF", use: "Secondary actions, highlights" },
  { className: "bg-ink", name: "Text Primary", value: "#0B0B1A", use: "Headings, primary text" },
  { className: "bg-ink-secondary", name: "Text Secondary", value: "#6B7280", use: "Body text, secondary text" },
  { className: "bg-surface border border-line", name: "Surface White", value: "#FFFFFF", use: "Cards, sheets, modals" },
  { className: "bg-surface-gray", name: "Surface Gray", value: "#F4F5F7", use: "Inputs, chips, groups" },
  { className: "bg-line", name: "Border Gray", value: "#E5E7EB", use: "Dividers, borders" },
  { className: "bg-lavender-soft", name: "Glass Blur", value: "rgba(255,255,255,0.7)", use: "Tab bar, glass surfaces", glass: true },
];

const typeScale: { role: string; variant: TextVariant; sample: string; spec: string }[] = [
  { role: "Display", variant: "display", sample: "Find your next stay", spec: "Satoshi Black · 56 / 1.0" },
  { role: "Hero", variant: "hero", sample: "Find a stay that fits your story", spec: "Satoshi Black · 38 / 1.05" },
  { role: "Heading", variant: "heading", sample: "Modern Cabin with Hot Tub", spec: "Satoshi Black · 30 / 1.2" },
  { role: "Title", variant: "title", sample: "Oceanview Villa with Pool", spec: "Satoshi Bold · 20 / 1.25" },
  {
    role: "Body",
    variant: "body",
    sample: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
    spec: "Satoshi Regular · 16 / 1.5",
  },
  { role: "Caption", variant: "caption", sample: "Lake Arrowhead, CA", spec: "Satoshi Medium · 14 / 1.43" },
  { role: "Label", variant: "label", sample: "Home · Search · Trips", spec: "Satoshi Medium · 12 / 1.33" },
  { role: "Button", variant: "button", sample: "Book this stay", spec: "Satoshi Medium · 17 / 1.18" },
];

const filters = ["Cabins", "Under $300", "Pet Friendly", "Quiet"];
const categories: { label: string; icon: IconName }[] = [
  { label: "All Stays", icon: "home" },
  { label: "Cabins", icon: "tree" },
  { label: "Beach", icon: "wave" },
  { label: "City", icon: "city" },
  { label: "Villas", icon: "palm" },
];
const tabs: { label: string; icon: IconName }[] = [
  { label: "Home", icon: "home" },
  { label: "Search", icon: "search" },
  { label: "Trips", icon: "calendar" },
  { label: "Profile", icon: "user" },
];
const glyphs: IconName[] = ["home", "search", "heart", "calendar", "user", "settings", "pin", "sliders"];

function DesignSystemGallery() {
  const [filter, setFilter] = useState("Cabins");
  const [category, setCategory] = useState("All Stays");
  const [favorite, setFavorite] = useState(false);
  const [tab, setTab] = useState("Home");
  const [view, setView] = useState<"list" | "map">("list");
  const [toggle, setToggle] = useState(true);
  const [guests, setGuests] = useState(1);
  const [alerts, setAlerts] = useState({ success: true, danger: true });
  const [code, setCode] = useState("");
  const [partialCode, setPartialCode] = useState("424");
  const [badCode, setBadCode] = useState("123456");

  return (
    <>
      <Stack.Screen options={{ title: "Design system", headerShown: true }} />
      <ScrollView className="flex-1 bg-surface-gray" contentContainerClassName="gap-3 px-3 py-4 pb-12" contentInsetAdjustmentBehavior="automatic">
        <Section number="01" title="Brand">
          <Wordmark size="lg" />
          <Text variant="title" weight="regular" tone="muted">
            Find unforgettable stays for every kind of trip.
          </Text>
        </Section>

        <Section number="02" title="Color palette">
          <View className="-mx-1.5 flex-row flex-wrap gap-y-4">
            {swatches.map((swatch) => (
              <View key={swatch.name} className="w-1/2 gap-1.5 px-1.5">
                <View className={`h-16 overflow-hidden rounded-xl corner-squircle ${swatch.className}`}>
                  {swatch.glass ? <View className="absolute inset-2 rounded-lg bg-glass" /> : null}
                </View>
                <View>
                  <Text variant="caption" bold>
                    {swatch.name}
                  </Text>
                  <Text variant="label" tone="secondary">
                    {swatch.value}
                  </Text>
                  <Text variant="label" tone="muted">
                    {swatch.use}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section number="03" title="Typography">
          {typeScale.map(({ role, variant, sample, spec }) => (
            <View key={role} className="gap-1 border-b border-line pb-4">
              <View className="flex-row justify-between">
                <Text variant="label" tone="secondary">
                  {role}
                </Text>
                <Text variant="label" tone="muted">
                  {spec}
                </Text>
              </View>
              <Text variant={variant} tone={variant === "body" ? "secondary" : "ink"}>
                {sample}
              </Text>
            </View>
          ))}
        </Section>

        <Section number="04" title="Buttons">
          <Group label="Primary">
            <Button title="Book this stay" trailingIcon="arrow-right" />
          </Group>
          <Group label="Secondary">
            <Button title="Continue with Google" variant="secondary" leading={<GoogleLogo />} />
          </Group>
          <Group label="Icon buttons">
            <View className="flex-row gap-3">
              <IconButton icon="heart" accessibilityLabel="Save" size="lg" />
              <IconButton icon="share" accessibilityLabel="Share" size="lg" />
              <IconButton icon="search" accessibilityLabel="Search" size="lg" />
              <IconButton icon="bookmark" accessibilityLabel="Bookmark" size="lg" />
            </View>
          </Group>
          <Group label="Loading · Disabled">
            <View className="flex-row gap-3">
              <Button title="Loading" loading className="flex-1" />
              <Button title="Disabled" disabled className="flex-1" />
            </View>
          </Group>
        </Section>

        <Section number="05" title="Input fields">
          <Group label="Search field">
            <TextField
              leadingIcon="search"
              placeholder="Search stays"
              defaultValue="Cabins in California"
              trailing={<Icon name="sliders" size={22} />}
            />
          </Group>
          <Group label="Form field (default) · tap to focus">
            <TextField leadingIcon="user" placeholder="Enter your name" />
          </Group>
          <Group label="Form field (stacked label)">
            <TextField leadingIcon="user" label="Full name" placeholder="e.g. Joanna Smith" />
          </Group>
          <Group label="Password field">
            <TextField leadingIcon="lock" placeholder="Password" secure defaultValue="password1" />
          </Group>
          <Group label="Error">
            <TextField leadingIcon="mail" placeholder="you@example.com" error="Enter a valid email address" />
          </Group>
          <Group label="Code field · tap to focus">
            <CodeField value={code} onChangeText={setCode} />
          </Group>
          <Group label="Code field (partly filled)">
            <CodeField value={partialCode} onChangeText={setPartialCode} />
          </Group>
          <Group label="Code field (error)">
            <CodeField value={badCode} onChangeText={setBadCode} error="That code isn't right" />
          </Group>
        </Section>

        <Section number="06" title="Filter chips">
          <Group label="Refinements">
            <View className="flex-row flex-wrap gap-2">
              {filters.map((label) => (
                <Chip key={label} label={label} selected={filter === label} onPress={() => setFilter(label)} />
              ))}
            </View>
          </Group>
          <Group label="Categories">
            <View className="flex-row flex-wrap gap-2">
              {categories.map(({ label, icon }) => (
                <Chip
                  key={label}
                  variant="category"
                  label={label}
                  icon={icon}
                  selected={category === label}
                  onPress={() => setCategory(label)}
                />
              ))}
            </View>
          </Group>
        </Section>

        <Section number="07" title="Listing card">
          <ListingCard
            title="Modern Cabin with Hot Tub"
            location="Lake Arrowhead, CA"
            imageUri="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600"
            rating={4.9}
            reviewCount={342}
            price={280}
            amenities={[
              { icon: "hot-tub", label: "Hot Tub" },
              { icon: "paw", label: "Pet Friendly" },
            ]}
            favorite={favorite}
            onToggleFavorite={() => setFavorite((value) => !value)}
          />
        </Section>

        <Section number="08" title="Policy card">
          <PolicyCard icon="chat" title="Ask about policies" description="Cancellation, house rules, pets, check-in and more." />
          <PolicyCard icon="document" title="Free cancellation" description="Full refund up to 7 days before check-in." />
        </Section>

        <Section number="09" title="Profile row">
          <ListGroup title="Account">
            <ListRow icon="user" label="Personal info" />
            <ListRow icon="card" label="Payment methods" />
            <ListRow icon="suitcase" label="Trips" />
          </ListGroup>
        </Section>

        <Section number="10" title="Bottom navigation">
          <TabBar>
            {tabs.map(({ label, icon }) => (
              <TabBarItem key={label} label={label} icon={icon} isFocused={tab === label} onPress={() => setTab(label)} />
            ))}
          </TabBar>
        </Section>

        <Section number="11" title="Iconography">
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {glyphs.map((name) => (
              <View key={name} className="w-1/4 items-center gap-1">
                <View className="h-12 w-12 items-center justify-center rounded-full border border-line bg-surface">
                  <Icon name={name} size={22} />
                </View>
                <Text variant="label" tone="muted">
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section number="12" title="Segmented control">
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "List", icon: "list" },
              { value: "map", label: "Map", icon: "map" },
            ]}
          />
        </Section>

        <Section number="13" title="Toggles / Steppers">
          <View className="flex-row items-center justify-between">
            <Text variant="caption">Instant book</Text>
            <Toggle value={toggle} onValueChange={setToggle} accessibilityLabel="Instant book" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text variant="caption">Guests</Text>
            <Stepper value={guests} onChange={setGuests} min={1} max={16} accessibilityLabel="Guests" />
          </View>
        </Section>

        <Section number="14" title="Status / Alerts">
          {alerts.success ? (
            <AlertBanner
              tone="success"
              message="Account created successfully"
              onDismiss={() => setAlerts((value) => ({ ...value, success: false }))}
            />
          ) : null}
          {alerts.danger ? (
            <AlertBanner
              tone="danger"
              message="Something went wrong. Please try again."
              onDismiss={() => setAlerts((value) => ({ ...value, danger: false }))}
            />
          ) : null}
          {!alerts.success || !alerts.danger ? (
            <Button title="Show alerts again" variant="ghost" size="md" onPress={() => setAlerts({ success: true, danger: true })} />
          ) : null}
        </Section>

        <Section number="15" title="Tags / Badges">
          <View className="flex-row flex-wrap gap-2">
            <Badge tone="favorite" icon="star" iconFilled label="Guest favorite" />
            <Badge tone="success" label="New" />
            <Badge tone="promo" label="20% off" />
            <Badge tone="info" label="Superhost" />
            <Badge tone="accent" icon="star" iconFilled label="Roam Explorer" />
          </View>
          <Group label="Amenity tags">
            <View className="flex-row flex-wrap gap-2">
              <Badge size="sm" icon="hot-tub" label="Hot Tub" />
              <Badge size="sm" icon="paw" label="Pet Friendly" />
              <Badge size="sm" icon="wifi" label="Fast Wi-Fi" />
              <Badge size="sm" icon="mountain" label="Forest Views" />
            </View>
          </Group>
        </Section>
      </ScrollView>
    </>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-3xl bg-surface p-4 corner-squircle">
      <Text variant="title" accessibilityRole="header">
        <Text variant="title" tone="muted">
          {number}{" "}
        </Text>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="label" tone="secondary">
        {label}
      </Text>
      {children}
    </View>
  );
}
