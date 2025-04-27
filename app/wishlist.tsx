import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts, Itim_400Regular } from "@expo-google-fonts/itim";
import SwapRequest from "./swaprequest";

const WishlistScreen = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const [fontsLoaded] = useFonts({ Itim: Itim_400Regular });

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedItems = await AsyncStorage.getItem("wishlistItems");
        if (storedItems) {
          setWishlistItems(JSON.parse(storedItems));
        }
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    };

    loadWishlist();
  }, []);

  const toggleWishlist = async (item: any) => {
    try {
      const storedItems = await AsyncStorage.getItem("wishlistItems");
      let wishlistItems = storedItems ? JSON.parse(storedItems) : [];
      const updatedItems = wishlistItems.filter((i: any) => i._id !== item._id);
      
      setWishlistItems(updatedItems);
      await AsyncStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
      
      // Also update the wishlist IDs
      const storedWishlist = await AsyncStorage.getItem("wishlist");
      if (storedWishlist) {
        const wishlist = JSON.parse(storedWishlist);
        const updatedWishlist = wishlist.filter((id: string) => id !== item._id);
        await AsyncStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <>
      <View style={styles.container}>
        <View style={{ backgroundColor: "#fff", paddingBottom: 0 }}>
          <View style={styles.header}>
            <Text style={styles.logo}>Wishlist</Text>
          </View>
        </View>

        <FlatList
          data={wishlistItems}
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "gray" }}>
              Your wishlist is empty.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.imageUris?.[0] }}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>{item.productName}</Text>
              <Text style={styles.cardSubtext}>Wants {item.wants}</Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location-outline" size={12} color="gray" /> {item.city}
              </Text>
              <TouchableOpacity
                style={styles.swapButton}
                onPress={() => setIsSwapModalVisible(true)}
              >
                <Text style={styles.swapText}>Swap now</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.heartIcon}
                onPress={() => toggleWishlist(item)}
              >
                <Ionicons name="heart" size={17} color="#7E4DD1" />
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Ionicons name="grid-outline" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/addswap")}>
          <FontAwesome5 name="plus" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/wishlist")}>
          <FontAwesome5 name="heart" size={24} color="#7E4DD1" solid />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: { 
    fontSize: 24, 
    color: "#7E4DD1" 
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: 10,
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
    right: 10 
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
    fontSize: 14 
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

export default WishlistScreen;
