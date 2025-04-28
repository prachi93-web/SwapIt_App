import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SwapRequest from "./swaprequest";

// Define the type for Product
interface Product {
  _id: string;
  productName: string;
  wants: string;
  city: string;
  imageUris: string[];
  category: string;
  userId: string;
}

const CategoryProductsScreen = () => {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  const toggleWishlist = async (item: Product) => {
    try {
      // Get current user data
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not found");
      }
      const user = JSON.parse(userData);

      // Get user's wishlist
      const wishlistKey = `wishlist_${user.uid}`;
      const wishlistItemsKey = `wishlistItems_${user.uid}`;
      
      const storedWishlist = await AsyncStorage.getItem(wishlistKey);
      const storedItems = await AsyncStorage.getItem(wishlistItemsKey);
      
      let wishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
      let wishlistItems = storedItems ? JSON.parse(storedItems) : [];

      if (wishlist.includes(item._id)) {
        // Remove from wishlist
        wishlist = wishlist.filter((id: string) => id !== item._id);
        wishlistItems = wishlistItems.filter((i: any) => i._id !== item._id);
      } else {
        // Add to wishlist - only store essential data
        wishlist.push(item._id);
        wishlistItems.push({
          _id: item._id,
          productName: item.productName,
          wants: item.wants,
          city: item.city,
          imageUri: item.imageUris?.[0], // Store only the first image URL
          category: item.category
        });
      }

      setWishlist(wishlist);
      await AsyncStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      await AsyncStorage.setItem(wishlistItemsKey, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Error updating wishlist:", error);
      Alert.alert("Error", "Failed to update wishlist. Please try again.");
    }
  };

  const loadWishlist = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not found");
      }
      const user = JSON.parse(userData);

      const wishlistKey = `wishlist_${user.uid}`;
      const stored = await AsyncStorage.getItem(wishlistKey);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        console.log('Fetching products for category:', category);
        const response = await axios.get(
          `http://10.10.24.70:5000/api/products?category=${category}`
        );
        console.log('Response:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error instanceof AxiosError && error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
      loadWishlist();
    }
  }, [category]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7E4DD1" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found for {category}.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#fff", paddingBottom: 0 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>{category}</Text>
        </View>
      </View>

      <FlatList
        data={products}
        numColumns={2}
        columnWrapperStyle={styles.row}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 50 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.imageUris?.[0] || "https://via.placeholder.com/150",
              }}
              style={styles.cardImage}
            />
            <Text style={styles.cardTitle}>{item.productName}</Text>
            <Text style={styles.cardSubtext}>Wants {item.wants}</Text>
            <Text style={styles.cardLocation}>
              <Ionicons name="location-outline" size={12} color="gray" /> {item.city}
            </Text>

            <TouchableOpacity
              style={styles.swapButton}
              onPress={() => {
                setSelectedItem(item);
                setIsSwapModalVisible(true);
              }}
            >
              <Text style={styles.swapText}>Swap now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heartIcon}
              onPress={() => toggleWishlist(item)}
            >
              <Ionicons
                name={wishlist.includes(item._id) ? "heart" : "heart-outline"}
                size={17}
                color="#7E4DD1"
              />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={isSwapModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsSwapModalVisible(false)}
      >
        <SwapRequest 
          onClose={() => setIsSwapModalVisible(false)} 
          productId={selectedItem?._id}
          productOwnerId={selectedItem?.userId}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: {
    fontSize: 24,
    color: "#7E4DD1",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: "#F4ECF6",
    borderRadius: 12,
    padding: 12,
    width: "48%",
    marginBottom: 10,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 16,
    color: "#4B0082",
    marginBottom: 5,
  },
  cardSubtext: {
    fontSize: 14,
    color: "gray",
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 12,
    color: "gray",
    marginBottom: 10,
  },
  heartIcon: {
    position: "absolute",
    top: 140,
    right: 10,
  },
  swapButton: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 8,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  swapText: {
    color: "white",
    fontSize: 14,
  },
});

export default CategoryProductsScreen;
