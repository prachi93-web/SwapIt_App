import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { signUp } from "../src/authService"; // ✅ Importing correctly

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  
  const handleSignUp = async () => {
    if (!fullName || !contactNumber || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
  
    try {
      const user = await signUp(fullName, contactNumber, email, password);
      console.log("User Created:", user);
  
      // ✅ Navigate to dashboard immediately after successful signup
      router.replace("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Signup Error:", errorMessage);
      Alert.alert("Signup Error", errorMessage);
    }
  };  
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="gray"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        autoComplete="off"
        importantForAutofill="no"
      />
      <TextInput
        placeholder="Contact Number"
        placeholderTextColor="gray"
        value={contactNumber}
        onChangeText={setContactNumber}
        style={styles.input}
        keyboardType="numeric"
        autoComplete="off"
        importantForAutofill="no"
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoComplete="off"
        importantForAutofill="no"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoComplete="off"
        importantForAutofill="no"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Already have an account?{" "}
        <Text style={styles.signupLink} onPress={() => router.push("/sign-in")}>
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontFamily: "Itim",
    marginBottom: 50,
    color: "#7E4DD1",
  },
  input: {
    width: "90%",
    padding: 9,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#E7DAEA",
    color: "#333",
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#C2A3E6",
  },
  button: {
    width: "90%",
    backgroundColor: "#7E4DD1",
    padding: 6,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Itim",
  },
  signupText: {
    marginTop: 10,
    color: "#7E4DD1",
    fontSize: 14,
  },
  signupLink: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
