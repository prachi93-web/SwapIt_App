import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Itim_400Regular } from "@expo-google-fonts/itim";
import { IstokWeb_400Regular } from "@expo-google-fonts/istok-web";
// import * as SplashScreen from "expo-splash-screen";

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    Itim: Itim_400Regular,
    IstokWeb: IstokWeb_400Regular,
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    if (!fontsLoaded) {
      return;
    }

    const timer = setTimeout(() => {
      router.push("/sign-in");
    }, 2000);

    return () => clearTimeout(timer);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show nothing until fonts are loaded
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title]}>SwapIt</Text>
      <Text style={[styles.subtitle]}>
        Swap anything, anytime — made easy!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E62D8",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
});
