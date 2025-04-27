import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TABS = ["Pending", "Accepted", "Cancelled"];

type RequestItem = {
  id: string;
  name: string;
  phone: string;
  country: string;
  product: string;
  city: string;
  pincode: string;
  image: any;
};

const requestsData: RequestItem[] = [
  {
    id: "1",
    name: "Prachi Mehetre",
    phone: "+91-7058817101",
    country: "India",
    product: "Bicycle",
    city: "Bandra, Mumbai",
    pincode: "400012",
    image: require("../assets/bike.png"),
  },
  {
    id: "2",
    name: "Sakshi Gambhire",
    phone: "+91-7058817101",
    country: "India",
    product: "Kettle",
    city: "Shivaji nagar, Pune",
    pincode: "458585",
    image: require("../assets/kettle.png"),
  },
  {
    id: "3",
    name: "Sanskruti Patil",
    phone: "+91-7058817101",
    country: "India",
    product: "Guitar",
    city: "Panchavati, Nashik",
    pincode: "422003",
    image: require("../assets/guitar.png"),
  },
  {
    id: "4",
    name: "Divya Bhavsar",
    phone: "+91-7058817101",
    country: "India",
    product: "Western Dress",
    city: "Panchavati, Nashik",
    pincode: "422003",
    image: require("../assets/dress.png"),
  },
];

const RequestsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const router = useRouter();

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const renderCard = ({ item }: { item: RequestItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.country}>{item.country}</Text>
        </View>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.detail}>Product Name : {item.product}</Text>
          <Text style={styles.detail}>City : {item.city}</Text>
          <Text style={styles.detail}>Pincode : {item.pincode}</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineBtn}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image source={item.image} style={styles.productImage} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/dashboard")}>
        <Ionicons name="chevron-back" size={26} color="black" />
      </TouchableOpacity>
      <Text style={styles.header}>Requests</Text>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedTab === "Pending" ? (
        <FlatList
          data={requestsData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ color: "gray", fontSize: 16 }}>No {selectedTab} requests</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10, paddingTop: 20 },
  backButton: { position: "absolute", top: 25, left: 10, zIndex: 1 },
  header: { textAlign: "center", fontSize: 20, fontWeight: "500", marginBottom: 25 },
  tabContainer: { flexDirection: "row", justifyContent: "center", gap: 25, marginBottom: 20 },
  tabText: { color: "gray", fontSize: 16 },
  activeTab: {
    color: "white",
    backgroundColor: "#7E4DD1",
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  card: {
    backgroundColor: "#DEC9F5",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9B5DE5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  name: { fontWeight: "bold", fontSize: 14, color: "#333" },
  country: { fontSize: 12, color: "#666" },
  phone: {
    fontSize: 12,
    color: "#555",
    position: "absolute",
    right: 0,
    top: 5,
  },
  detail: { fontSize: 12, color: "#222", marginTop: 2 },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  acceptBtn: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  acceptText: { color: "#fff", fontWeight: "600" },
  declineBtn: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  declineText: { color: "#fff", fontWeight: "600" },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginLeft: 10,
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
});

export default RequestsScreen;
