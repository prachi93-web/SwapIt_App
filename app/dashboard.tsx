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
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts, Itim_400Regular } from "@expo-google-fonts/itim";
import SwapRequest from "./swaprequest";

// Define types for our data
interface User {
  uid: string;
  email: string;
}

interface Item {
  _id: string | number;
  productName: string;
  wants: string;
  city: string;
  imageUris: string[];
}

const DashboardScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Itim: Itim_400Regular });
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState<string>("");
  const [isSwapModalVisible, setIsSwapModalVisible] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
    fetchItemsFromBackend();
    loadWishlist();
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
      const response = await fetch("http://localhost:5000/api/items/items");
      const data = await response.json();
      setItems(data as Item[]);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Frontend-only wishlist logic
  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem("user_wishlist");
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const toggleWishlist = async (itemId: string | number) => {
    const stringItemId = String(itemId);
    let updatedWishlist: string[];
    
    if (wishlistItems.includes(stringItemId)) {
      updatedWishlist = wishlistItems.filter(id => id !== stringItemId);
    } else {
      updatedWishlist = [...wishlistItems, stringItemId];
    }
    
    setWishlistItems(updatedWishlist);
    
    try {
      await AsyncStorage.setItem("user_wishlist", JSON.stringify(updatedWishlist));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  };

  const isInWishlist = (itemId: string | number): boolean => {
    return wishlistItems.includes(String(itemId));
  };

  if (!fontsLoaded) {
    return null;
  }

  const filteredItems = items.filter(
    (item) =>
      item.productName?.toLowerCase().includes(search.toLowerCase()) ||
      item.wants?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>SwapIt</Text>
        <TouchableOpacity onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={28} color="#7E4DD1" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="What are you looking for today?"
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        </View>
      </View>

      <View style={styles.container}>
        {user && (
          <Text style={styles.greeting}>
            HELLO 👋{"\n"}
            <Text style={styles.userName}>Prachi Mehetre</Text>
          </Text>
        )}

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => String(item._id)}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image 
                source={{ uri: item.imageUris?.[0] }} 
                style={styles.cardImage} 
                defaultSource={require('./assets/placeholder.png')}
              />
              
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text style={styles.cardSubtext} numberOfLines={1}>
                  Wants a {item.wants}
                </Text>
                <Text style={styles.cardLocation}>
                  <Ionicons name="location-outline" size={12} color="gray" /> {item.city}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.swapButton}
                onPress={() => setIsSwapModalVisible(true)}
              >
                <Text style={styles.swapText}>Swap now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.heartIcon}
                onPress={() => toggleWishlist(item._id)}
              >
                <Ionicons 
                  name={isInWishlist(item._id) ? "heart" : "heart-outline"} 
                  size={20} 
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
        <SwapRequest onClose={() => setIsSwapModalVisible(false)} />
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <FontAwesome5 name="home" size={24} color="#7E4DD1" solid />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Ionicons name="grid-outline" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/addswap")}
        >
          <FontAwesome5 name="plus" size={20} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/wishlist")}>
          <FontAwesome5 
            name={wishlistItems.length > 0 ? "heart" : "heart-outline"} 
            size={24} 
            color="#7E4DD1" 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/notification")}>
          <FontAwesome5 name="bell" size={24} color="#7E4DD1" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { 
    flex: 1, 
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logo: { 
    fontSize: 24, 
    color: "#7E4DD1", 
    fontWeight: "500" 
  },
  searchBarContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F4ECF6",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: "center",
  },
  searchInput: { 
    flex: 1, 
    fontSize: 14,
    color: "#666",
  },
  searchIcon: { 
    marginLeft: 5 
  },
  greeting: { 
    fontSize: 14,
    fontWeight: "500",
    color: "#7E4DD1", 
    marginTop: 5,
    marginBottom: 10,
    paddingLeft: 5,
  },
  userName: {
    color: "#7E4DD1", 
    fontSize: 16,
    fontWeight: "500",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#F4ECF6",
    marginBottom: 15,
    borderRadius: 12,
    width: "48%",
    position: "relative",
    overflow: "hidden",
    padding: 0,
  },
  cardImage: { 
    width: "100%", 
    height: 120, 
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    padding: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginTop: 4,
  },
  cardSubtext: {
    fontSize: 13,
    color: "gray",
    marginTop: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  heartIcon: { 
    position: "absolute", 
    top: 8, 
    right: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  swapButton: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
  },
  swapText: { 
    color: "white", 
    fontSize: 14,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#F4ECF6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DashboardScreen;