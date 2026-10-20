import { useSignUp } from "@clerk/expo";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, type TextInputInstance } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google-logo";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { clerkErrorCode, clerkErrorMessage } from "@/lib/auth/clerk-errors";

import { AuthHeader } from "./auth-header";
import { OrDivider } from "./or-divider";

type Fields = { name: string; email: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email }: Fields): Errors {
  const errors: Errors = {};
  if (!name.trim()) errors.name = "Enter your name";
  if (!EMAIL.test(email.trim())) errors.email = "Enter a valid email address";
  return errors;
}

// TODO(oauth): Google is enabled in Clerk but not wired up yet.
const PENDING_MESSAGE = "Google and Apple sign-in are coming soon.";

// Clerk stores first and last name separately; everything after the first word is the last name.
function splitName(name: string) {
  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ");
  return lastName ? { firstName, lastName } : { firstName };
}

export function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const { signUp } = useSignUp();
  const [fields, setFields] = useState<Fields>({ name: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInputInstance>(null);

  const update = (key: keyof Fields) => (value: string) => {
    const nextFields = { ...fields, [key]: value };
    setFields(nextFields);
    // After the first submit, re-validate as the user types so errors clear when fixed.
    if (submitted) setErrors(validate(nextFields));
  };

  const submit = async () => {
    setSubmitted(true);
    const nextErrors = validate(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || loading) return;
    setNotice(null);
    setFailure(null);
    setLoading(true);
    try {
      const created = await signUp.create({ emailAddress: fields.email.trim(), ...splitName(fields.name) });
      const sent = created.error ? created : await signUp.verifications.sendEmailCode();
      if (sent.error) {
        if (clerkErrorCode(sent.error) === "form_identifier_exists") {
          setErrors({ email: "An account with this email already exists. Sign in instead." });
        } else {
          setFailure(clerkErrorMessage(sent.error));
        }
        return;
      }
      router.push({ pathname: "/verify", params: { mode: "sign-up" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-gutter"
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }}
      >
        <AuthHeader />

        <Text variant="hero" accessibilityRole="header" className="mt-8">
          {"Create\nyour account"}
        </Text>
        <Text tone="muted" className="mt-3">
          Join roam to save your stays, get personalized recommendations and access them across all your devices.
        </Text>

        {notice ? <AlertBanner tone="success" message={notice} onDismiss={() => setNotice(null)} className="mt-6" /> : null}
        {failure ? <AlertBanner tone="danger" message={failure} onDismiss={() => setFailure(null)} className="mt-6" /> : null}

        <View className="mt-6 gap-4">
          <TextField
            leadingIcon="user"
            label="Full name"
            placeholder="e.g. Adrian Hajdin"
            value={fields.name}
            onChangeText={update("name")}
            error={errors.name}
            textContentType="name"
            autoComplete="name"
            autoCapitalize="words"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <TextField
            ref={emailRef}
            leadingIcon="mail"
            label="Email address"
            placeholder="you@example.com"
            value={fields.email}
            onChangeText={update("email")}
            error={errors.email}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
        </View>

        {/* Mount point for Clerk's bot protection (off for now, needed once it's on). */}
        <View nativeID="clerk-captcha" />

        <Button
          title="Create account"
          size="md"
          trailingIcon="arrow-right"
          loading={loading}
          onPress={submit}
          className="mt-6"
        />

        <OrDivider className="my-4" />

        <View className="gap-3">
          <Button
            title="Continue with Google"
            variant="secondary"
            size="md"
            leading={<GoogleLogo />}
            onPress={() => setNotice(PENDING_MESSAGE)}
          />
          {Platform.OS === "ios" ? (
            <Button
              title="Continue with Apple"
              variant="secondary"
              size="md"
              leading={<Icon name="apple" size={20} />}
              onPress={() => setNotice(PENDING_MESSAGE)}
            />
          ) : null}
        </View>

        <View className="mt-6 flex-row items-center justify-center gap-1.5">
          <Text variant="caption" tone="muted">
            Already have an account?
          </Text>
          <Link href="/sign-in" replace accessibilityRole="link">
            <Text variant="caption" className="underline">
              Sign in
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
