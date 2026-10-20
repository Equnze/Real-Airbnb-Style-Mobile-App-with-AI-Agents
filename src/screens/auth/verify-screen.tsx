import { useAuth, useSignIn, useSignUp } from "@clerk/expo";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import { CodeField } from "@/components/ui/code-field";
import { Text } from "@/components/ui/text";
import { clerkErrorMessage } from "@/lib/auth/clerk-errors";

import { AuthHeader } from "./auth-header";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_S = 30;

const formatCountdown = (seconds: number) => `0:${String(seconds).padStart(2, "0")}`;

// Runs just before the new session is set. Once it is, the isSignedIn redirect below moves on to
// home; navigating here would hit home's guard while still signed out.
const navigateAfterAuth = ({ session }: { session: { currentTask?: unknown } }) => {
  if (session.currentTask) console.warn("Clerk session has a pending task, which Roam doesn't handle yet");
};

// Enters the emailed code for both sign-up (?mode=sign-up) and sign-in (?mode=sign-in).
export function VerifyScreen() {
  const insets = useSafeAreaInsets();
  const { mode } = useLocalSearchParams<{ mode?: "sign-up" | "sign-in" }>();
  const isSignIn = mode === "sign-in";
  const { isSignedIn } = useAuth();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [notice, setNotice] = useState<{ tone: "success" | "danger"; message: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (isSignedIn) return <Redirect href="/home" />;

  // Only reachable mid-flow; "complete" stays here while finalize sets the session.
  const pending = isSignIn
    ? signIn.status === "needs_first_factor" || signIn.status === "complete"
    : (signUp.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address")) ||
      signUp.status === "complete";
  if (!pending) return <Redirect href={isSignIn ? "/sign-in" : "/sign-up"} />;

  const email = isSignIn ? signIn.identifier : signUp.emailAddress;

  const changeCode = (value: string) => {
    setCode(value);
    setCodeError(undefined);
  };

  const submit = async (value = code) => {
    if (value.length < CODE_LENGTH || loading) return;
    setLoading(true);
    try {
      if (isSignIn) {
        const { error } = await signIn.emailCode.verifyCode({ code: value });
        if (error) throw error;
        if (signIn.status === "complete") await signIn.finalize({ navigate: navigateAfterAuth });
      } else {
        const { error } = await signUp.verifications.verifyEmailCode({ code: value });
        if (error) throw error;
        if (signUp.status === "complete") await signUp.finalize({ navigate: navigateAfterAuth });
      }
    } catch (error) {
      setCode("");
      setCodeError(clerkErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setCooldown(RESEND_COOLDOWN_S);
    // The flow already knows the email, so no arguments.
    const { error } = isSignIn ? await signIn.emailCode.sendCode() : await signUp.verifications.sendEmailCode();
    setNotice(
      error
        ? { tone: "danger", message: clerkErrorMessage(error) }
        : { tone: "success", message: `We sent a new code to ${email}.` },
    );
  };

  const changeEmail = () => {
    if (isSignIn) signIn.reset();
    else signUp.reset();
    router.back();
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
          {"Check\nyour email"}
        </Text>
        <Text tone="muted" className="mt-3">
          We sent a 6-digit code to{" "}
          <Text weight="medium">{email}</Text>. Enter it below to {isSignIn ? "sign in" : "verify your account"}.
        </Text>

        {notice ? (
          <AlertBanner tone={notice.tone} message={notice.message} onDismiss={() => setNotice(null)} className="mt-6" />
        ) : null}

        <CodeField
          value={code}
          onChangeText={changeCode}
          length={CODE_LENGTH}
          onComplete={submit}
          error={codeError}
          autoFocus
          className="mt-6"
        />

        <Button
          title={isSignIn ? "Sign in" : "Verify email"}
          size="md"
          trailingIcon="arrow-right"
          disabled={code.length < CODE_LENGTH}
          loading={loading}
          onPress={() => submit()}
          className="mt-6"
        />

        <View className="mt-6 items-center">
          {cooldown > 0 ? (
            <Text variant="caption" tone="muted" accessibilityLiveRegion="polite">
              Resend code in {formatCountdown(cooldown)}
            </Text>
          ) : (
            <Pressable accessibilityRole="button" hitSlop={8} onPress={resend}>
              <Text variant="caption" className="underline">
                Resend code
              </Text>
            </Pressable>
          )}
        </View>

        <View className="mt-3 flex-row items-center justify-center gap-1.5">
          <Text variant="caption" tone="muted">
            Wrong email?
          </Text>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={changeEmail}>
            <Text variant="caption" className="underline">
              Change it
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
