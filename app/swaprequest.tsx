import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

interface Props {
  onClose: () => void;
}

const SwapRequest: React.FC<Props> = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {/* Close Icon */}
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#7E4DD1" />
        </TouchableOpacity>

        {/* Inputs */}
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            placeholderTextColor="#888"
            value={productName}
            onChangeText={setProductName}
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#888"
            value={city}
            onChangeText={setCity}
          />

          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#888"
            value={pincode}
            onChangeText={setPincode}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.uploadButton}>
            <Feather name="upload" size={20} color="#7E4DD1" />
            <Text style={styles.uploadText}>Upload image of product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send Swap Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "80%",
    backgroundColor: "#E7DAEA",
    borderRadius: 16,
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  content: {
    marginTop: 20, // space below the close icon
  },
  input: {
    width: "100%",
    backgroundColor: "#F7EDFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 14,
    color: "#333",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7EDFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 18,
  },
  uploadText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#888",
  },
  sendButton: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 12,
    borderRadius: 10,
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default SwapRequest;
