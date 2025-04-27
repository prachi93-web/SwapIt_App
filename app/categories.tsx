import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

const categoriesData = [
  {
    title: "HOUSEHOLD ESSENTIALS",
    data: [
      { label: "Electronic Appliances", icon: require("../assets/electronics.png") },
      { label: "Kitchen Appliances", icon: require("../assets/kitchen.png") },
      { label: "Furniture", icon: require("../assets/furniture.png") },
      { label: "Toys and Sports", icon: require("../assets/toys.png") },
    ],
  },
  {
    title: "FASHION & ACCESSORIES",
    data: [
      { label: "Men's Wear", icon: require("../assets/menswear.png") },
      { label: "Women's Wear", icon: require("../assets/womenswear.png") },
      { label: "Footwear", icon: require("../assets/footwear.png") },
      { label: "Accessories", icon: require("../assets/accessories.png") },
    ],
  },
  {
    title: "ELECTRONIC GADGETS",
    data: [
      { label: "Mobile Phones", icon: require("../assets/mobilephones.png") },
      { label: "Computers & Laptops", icon: require("../assets/computers.png") },
      { label: "Gaming Consoles", icon: require("../assets/gaming.png") },
      { label: "Cameras & Photography", icon: require("../assets/cameras.png") },
    ],
  },
  {
    title: "BOOKS & STATIONARY",
    data: [
      { label: "Academic Books", icon: require("../assets/books.png") },
      { label: "Novels & Comics", icon: require("../assets/books.png") },
      { label: "Office Supplies", icon: require("../assets/office.png") },
    ],
  },
  {
    title: "VEHICLES & ACCESSORIES",
    data: [
      { label: "Bicycle", icon: require("../assets/bicycle.png") },
      { label: "Motorcycle & Scooter", icon: require("../assets/scooter.png") },
      { label: "Car Accessories", icon: require("../assets/scooter.png") },
    ],
  },
];

const CategoriesScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={{ backgroundColor: "#fff", paddingBottom: 0 }}>
        <View style={styles.header}>
          <Text style={styles.logo}>Categories</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={28} color="#7E4DD1" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Categories */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {categoriesData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.grid}>
              {section.data.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.categoryBox}
                  onPress={() => {
                    router.push({
                      pathname: '/categoryProducts',
                      params: { category: item.label }, // <-- Sending selected category
                    });
                  }}
                >
                  <View style={styles.icon}>
                    <Image source={item.icon} style={{ width: 90, height: 90, resizeMode: "contain" }} />
                  </View>
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push("/dashboard")}>
          <Ionicons name="home-outline" size={24} color="#7E4DD1" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/categories")}>
          <Ionicons name="grid" size={24} color="#7E4DD1" />
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
  section: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 0,
    color: "#7E4DD1",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
  },
  categoryBox: {
    width: 90,
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#E7DAEA",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    resizeMode: "contain",
  },
  label: {
    fontSize: 13,
    textAlign: "center",
    color: "#000",
    marginTop: 6,
  },
  navbar: {
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

export default CategoriesScreen;
