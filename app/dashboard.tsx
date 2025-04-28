// DashboardScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts, Itim_400Regular } from "@expo-google-fonts/itim";
import SwapRequest from "./swaprequest";

const DashboardScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Itim: Itim_400Regular });
  const [user, setUser] = useState<{ uid: string; email: string; fullName: string } | null>(null);
  const [search, setSearch] = useState("");
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const [items, setItems] = useState<{
    _id: string;
    productName: string;
    wants: string;
    city: string;
    imageUris: string[];
    category: string;
    createdAt: string;
    userId: string;
  }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<{ 
    _id: string; 
    productName: string; 
    wants: string; 
    city: string; 
    imageUris: string[]; 
    category: string; 
    createdAt: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    checkAuth();
    fetchItemsFromBackend();
    loadWishlistFromStorage();
  }, []);

  const checkAuth = async () => {
    try {
      const loggedUser = await AsyncStorage.getItem("user");
      if (!loggedUser) {
        router.replace("/sign-in");
      } else {
        setUser(JSON.parse(loggedUser));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  const fetchItemsFromBackend = async () => {
    try {
      console.log('Fetching items from backend...');
      const response = await fetch("http://10.10.24.70:5000/api/items");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received items:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      Alert.alert(
        "Error",
        "Failed to fetch items. Please check your connection and try again."
      );
    }
  };

  const loadWishlistFromStorage = async () => {
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
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  const toggleWishlist = async (item: any) => {
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
        setWishlistMessage("Product removed from wishlist");
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
        setWishlistMessage("Product saved in your wishlist");
      }

      setWishlist(wishlist);
      await AsyncStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      await AsyncStorage.setItem(wishlistItemsKey, JSON.stringify(wishlistItems));

      setTimeout(() => setWishlistMessage(""), 2000);
    } catch (err) {
      console.error("Error updating wishlist:", err);
      Alert.alert("Error", "Failed to update wishlist. Please try again.");
    }
  };

  if (!fontsLoaded) return null;

  const filteredItems = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.wants.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <View style={{ backgroundColor: "#fff", paddingBottom: 0 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>SwapIt</Text>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Ionicons name="person-circle-outline" size={28} color="#7E4DD1" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for today?"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {user && (
          <Text style={styles.greeting}>
            HELLO 👋{"\n"}
            <Text style={{ color: "#7E4DD1", fontSize: 16, marginTop: 10 }}>
              {user.fullName}
            </Text>
          </Text>
        )}

        <FlatList
          data={filteredItems}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item, index) => (item?._id ?? index).toString()}
          contentContainerStyle={{ paddingBottom: 50 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.imageUris?.[0] || "https://via.placeholder.com/150" }}
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
                  console.log('Selected item for swap:', item);
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
      </View>

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

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <FontAwesome5 name="home" size={24} color="#7E4DD1" solid />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Ionicons name="grid-outline" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/addswap")}>
          <FontAwesome5 name="plus" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/wishlist")}>
          <FontAwesome5 name="heart" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <FontAwesome5 name="bell" size={24} color="#7E4DD1" />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
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
  },
  logo: {
    fontSize: 24,
    color: "#7E4DD1",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F4ECF6",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 1,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchIcon: { marginRight: 10 },
  greeting: {
    fontSize: 16,
    color: "#7E4DD1",
    marginBottom: 15,
    marginLeft: 4,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default DashboardScreen;
