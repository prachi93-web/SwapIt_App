import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

const AddSwapScreen = () => {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [wants, setWants] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [category, setCategory] = useState("Electronic Appliances");
  const [imageUris, setImageUris] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((asset) => asset.uri);
      setImageUris((prev) => [...prev, ...newUris]);
    }
  };

  const removeImage = (uriToRemove: string) => {
    setImageUris((prev) => prev.filter((uri) => uri !== uriToRemove));
  };

  const handleSubmit = async () => {
    if (!productName || !wants || !city || !pinCode || !category || imageUris.length === 0) {
      Alert.alert("Please fill all the fields and upload at least one image.");
      return;
    }
  
    const swapData = {
      productName,
      wants,
      city,
      pinCode,
      category,
      imageUris, // make sure these are actual URLs or base64 strings
    };
  
    try {
      const response = await fetch("http://10.10.24.70:5000/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(swapData),
      });
  
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Swap added successfully!");
        router.push("/dashboard");
      } else {
        Alert.alert("Error", result.message || "Failed to add swap.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/dashboard")}>
            <Ionicons name="arrow-back" size={20} color="#000" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Add Item</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Product Name"
            placeholderTextColor="#7E4DD1"
            style={styles.input}
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            placeholder="Wants"
            placeholderTextColor="#7E4DD1"
            style={styles.input}
            value={wants}
            onChangeText={setWants}
          />
          <TextInput
            placeholder="City"
            placeholderTextColor="#7E4DD1"
            style={styles.input}
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            placeholder="Pin Code"
            placeholderTextColor="#7E4DD1"
            style={styles.input}
            keyboardType="numeric"
            value={pinCode}
            onChangeText={setPinCode}
          />

          {/* Category Picker */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
              dropdownIconColor="#7E4DD1"
            >
              <Picker.Item label="Electronic Appliances" value="Electronic Appliances" />
              <Picker.Item label="Kitchen Appliance" value="Kitchen Appliances" />
              <Picker.Item label="Books" value="Books" />
              <Picker.Item label="Furniture" value="Furniture" />
              <Picker.Item label="Toys and Sports" value="Toys and Sports" />
              <Picker.Item label="Men's Wear" value="Men's Wear" />
              <Picker.Item label="Women's Wear" value="Women's Wear" />
              <Picker.Item label="Footwear" value="Footwear" />
              <Picker.Item label="Accessories" value="Accessories" />
              <Picker.Item label="Mobile Phones" value="Mobile Phones" />
              <Picker.Item label="Computers & Laptops" value="Computers & Laptops" />
              <Picker.Item label="Gaming Consoles" value="Gaming Consoles" />
              <Picker.Item label="Cameras & Photography" value="Cameras & Photography" />
              <Picker.Item label="Academic Books" value="Academic Books" />
              <Picker.Item label="Novels & Comics" value="Novels & Comics" />
              <Picker.Item label="Office Supplies" value="Office Supplies" />
              <Picker.Item label="Bicycle" value="Bicycle" />
              <Picker.Item label="Motorcycle & Scooter" value="Motorcycle & Scooter" />
              <Picker.Item label="Car Accessories" value="Car Accessories" />
            </Picker>
          </View>

          {/* Image Upload */}
          <TouchableOpacity style={styles.uploadContainer} onPress={pickImage}>
            {imageUris.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {imageUris.map((uri, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri }} style={styles.imageThumb} />
                    <TouchableOpacity
                      style={styles.removeIcon}
                      onPress={() => removeImage(uri)}
                    >
                      <Ionicons name="close-circle" size={18} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.uploadTextRow}>
                <Text style={styles.uploadText}>Upload product images</Text>
                <Ionicons name="cloud-upload-outline" size={18} color="#7E4DD1" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Swap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 80,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F3F8",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginRight: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  formContainer: {
    gap: 20,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#B088EF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#F5ECFF",
  },
  pickerContainer: {
    borderColor: "#B088EF",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#F5ECFF",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    borderColor: "#B088EF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#7E4DD1",
    backgroundColor: "#F5ECFF",
  },
  uploadContainer: {
    height: 50,
    borderColor: "#B088EF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F5ECFF",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  uploadTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  uploadText: {
    color: "#7E4DD1",
    fontSize: 14,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
  },
  imageThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  removeIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});

export default AddSwapScreen;