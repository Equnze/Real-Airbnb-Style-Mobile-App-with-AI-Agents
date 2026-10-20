import { useSignIn } from "@clerk/expo";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { clerkErrorCode, clerkErrorMessage } from "@/lib/auth/clerk-errors";

import { AuthHeader } from "./auth-header";

type Fields = { email: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email }: Fields): Errors {
  const errors: Errors = {};
  if (!EMAIL.test(email.trim())) errors.email = "Enter a valid email address";
  return errors;
}

export function SignInScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useSignIn();
  const [fields, setFields] = useState<Fields>({ email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setFailure(null);
    setLoading(true);
    try {
      // Starts the sign-in and emails a code; Verify finishes it.
      const { error } = await signIn.emailCode.sendCode({ emailAddress: fields.email.trim() });
      if (error) {
        if (clerkErrorCode(error) === "form_identifier_not_found") {
          setErrors({ email: "No account uses this email. Create one instead." });
        } else {
          setFailure(clerkErrorMessage(error));
        }
        return;
      }
      router.push({ pathname: "/verify", params: { mode: "sign-in" } });
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
          {"Welcome\nback"}
        </Text>
        <Text tone="muted" className="mt-3">
          Sign in to see your saved stays and pick up where you left off.
        </Text>

        {failure ? <AlertBanner tone="danger" message={failure} onDismiss={() => setFailure(null)} className="mt-6" /> : null}

        <View className="mt-6 gap-4">
          <TextField
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

        <Button
          title="Sign in"
          size="md"
          trailingIcon="arrow-right"
          loading={loading}
          onPress={submit}
          className="mt-6"
        />

        <View className="mt-6 flex-row items-center justify-center gap-1.5">
          <Text variant="caption" tone="muted">
            New to roam?
          </Text>
          <Link href="/sign-up" replace accessibilityRole="link">
            <Text variant="caption" className="underline">
              Create an account
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
