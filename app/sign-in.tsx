import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const SignInScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // Store user data in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        email: user.email,
        fullName: userData?.fullName || ""
      }));

      console.log("🔁 Redirecting to dashboard...");
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      console.error("❌ Firebase error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => router.push("/forgot-password")}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Spacing */}
      <View style={{ marginTop: 8 }} />

      {/* Sign Up Link */}
      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/sign-up")}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, color: "#7E4DD1", marginBottom: 50 },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "#E7DAEA",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#C2A3E6"
  },
  button: {
    backgroundColor: "#7E4DD1",
    padding: 6,
    borderRadius: 12,
    width: "82%",
    alignItems: "center",
    marginTop: 20
  },
  buttonText: { color: "#fff", fontSize: 22 },
  linkText: {
    marginTop: 15,
    color: "#7E4DD1",
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  footerText: { marginTop: 8, color: "#7E4DD1" },
  link: { fontWeight: "bold", color: "#7E4DD1", textDecorationLine: "underline" },
});

export default SignInScreen;
