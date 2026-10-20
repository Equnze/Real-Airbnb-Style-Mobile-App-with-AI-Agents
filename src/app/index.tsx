import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

// Onboarding shows on every signed-out launch until a "seen" flag is added.
export default function Index() {
  const { isSignedIn } = useAuth();
  return <Redirect href={isSignedIn ? "/home" : "/onboarding"} />;
}
