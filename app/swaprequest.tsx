import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Props {
  onClose: () => void;
}

const SwapRequest: React.FC<Props> = ({ onClose }) => {
  const [productName, setProductName] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch("http://10.10.24.70:5000/api/test");
      const data = await response.json();
      console.log('Backend test response:', data);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    if (!productName || !city || !pincode || !imageUri) {
      Alert.alert("Error", "Please fill in all fields and upload an image");
      return;
    }

    try {
      setLoading(true);
      console.log('Starting swap request process...');

      // Get current user data
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not found");
      }
      const user = JSON.parse(userData);
      console.log('Current user:', user);

      // Create swap request object (send local imageUri, let backend handle Cloudinary upload)
      const swapRequest = {
        productName,
        city,
        pincode,
        imageUri, // local URI, backend will upload to Cloudinary
        requesterId: user.uid,
        requesterName: user.fullName,
        requesterContact: user.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      console.log('Sending swap request:', JSON.stringify(swapRequest, null, 2));

      // Send request to backend
      const response = await fetch("http://10.10.24.70:5000/api/swap-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(swapRequest),
      });

      console.log('Response status:', response.status);
      const swapResponseText = await response.text();
      console.log('Response text:', swapResponseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(swapResponseText);
        } catch (e) {
          errorData = { message: swapResponseText };
        }
        throw new Error(errorData.message || "Failed to send swap request");
      }

      const result = JSON.parse(swapResponseText);
      console.log('Swap request sent successfully:', result);

      // Close the modal and show success message
      onClose();
      Alert.alert(
        "Success",
        "Swap request sent successfully! The owner will be notified.",
        [{ 
          text: "OK",
          onPress: () => {
            router.replace("/dashboard");
          }
        }]
      );
    } catch (error: any) {
      console.error("Error sending swap request:", error);
      Alert.alert("Error", error?.message || "Failed to send swap request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {/* Close Icon */}
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={24} color="#7E4DD1" />
        </TouchableOpacity>

        {/* Inputs */}
        <ScrollView style={styles.content}>
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

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <>
                <Feather name="upload" size={20} color="#7E4DD1" />
                <Text style={styles.uploadText}>Upload image of product</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.sendButton, loading && styles.sendButtonDisabled]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? "Sending..." : "Send Swap Request"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  uploadedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 12,
    borderRadius: 10,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default SwapRequest;
