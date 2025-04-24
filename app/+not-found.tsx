import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useRootNavigationState } from "expo-router"; // ✅ Correct hook

export default function NotFoundScreen() {
  const router = useRouter();
  const navigationState = useRootNavigationState(); // ✅ Get navigation state

  useEffect(() => {
    if (navigationState?.key) {
      router.replace("/home"); // ✅ Redirect only when navigation is ready
    }
  }, [navigationState?.key]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#8E62D8" />
    </View>
  );
}
