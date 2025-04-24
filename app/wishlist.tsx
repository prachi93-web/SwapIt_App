import React from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFonts, Itim_400Regular } from "@expo-google-fonts/itim";

const WishlistScreen = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Itim: Itim_400Regular });

  const items = [
    { id: 1, name: "iPhone pro", wants: "a laptop", location: "New York", image: require("../assets/kettle.png") },
    { id: 2, name: "Western Dress", wants: "a Baggy Jeans", location: "Washington DC", image: require("../assets/dress.png") },
    { id: 3, name: "Bicycle", wants: "a HeadSet", location: "Jaipur", image: require("../assets/bike.png") },
    { id: 4, name: "Guitar", wants: "a Piano", location: "Mumbai", image: require("../assets/guitar.png") },
    { id: 5, name: "Bicycle", wants: "a HeadSet", location: "Jaipur", image: require("../assets/bike.png") },
    { id: 6, name: "Bicycle", wants: "a HeadSet", location: "Jaipur", image: require("../assets/bike.png") },
  ];

  if (!fontsLoaded) return null;

  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: "#fff", paddingBottom: 0 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/dashboard")}>
            <Ionicons name="arrow-back" size={24} color="#7E4DD1" />
          </TouchableOpacity>
          <Text style={styles.logo}>Wishlist</Text>
          <View style={{ width: 24 }} /> {/* Placeholder to balance layout */}
        </View>
      </View>

      {/* Content */}
      <View style={styles.container}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtext}>Wants {item.wants}</Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location-outline" size={12} color="gray" /> {item.location}
              </Text>
              <TouchableOpacity 
                style={styles.swapButton}
                onPress={() => router.push("/swaprequest")} >
                <Text style={styles.swapText}>Swap now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart" size={17} color="#7E4DD1" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  logo: { fontSize: 24, color: "#7E4DD1" },

  card: {
    flex: 1,
    backgroundColor: "#E7DAEA",
    margin: 5,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    maxWidth: "48%",
    position: "relative",
  },
  cardImage: { width: "100%", height: 120, borderRadius: 10, marginBottom: 5 },
  cardTitle: { fontSize: 16, color: "#4B0082", alignSelf: "flex-start" },
  cardSubtext: { fontSize: 14, color: "gray", alignSelf: "flex-start" },
  cardLocation: { fontSize: 12, color: "gray", marginBottom: 5, alignSelf: "flex-start" },
  heartIcon: { position: "absolute", top: 140, right: 10 },

  swapButton: {
    backgroundColor: "#7E4DD1",
    paddingVertical: 8,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  swapText: { color: "white", fontSize: 14 },

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
