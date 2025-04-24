import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { AntDesign } from "@expo/vector-icons"; // for back arrow icon

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Input Required", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset link sent to your email.");
      router.back(); // go back to Sign In screen
    } catch (error: any) {
      console.error("Reset error:", error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.heading}>Forgot password?</Text>
      <Text style={styles.subText}>
        Enter email associated with your account and we'll send an email with instructions to reset your password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email here"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send verification link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  backArrow: { position: "absolute", top: 40, left: 20 },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7E4DD1",
    marginBottom: 20,
    marginTop: 20,
  },
  subText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 40,
    maxWidth: "90%",
  },
  input: {
    backgroundColor: "#E5D8FD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 30,
    color: "#000",
  },
  button: {
    backgroundColor: "#7E4DD1",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
