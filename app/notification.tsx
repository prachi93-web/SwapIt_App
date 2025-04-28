import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TABS = ["Pending", "Accepted", "Cancelled"];

type RequestItem = {
  _id: string;
  productName: string;
  city: string;
  pincode: string;
  imageUri: string;
  requesterId: string;
  requesterName: string;
  requesterContact: string;
  status: string;
  createdAt: string;
  productOwnerId: string;
};

const RequestsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("Pending");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        throw new Error("User not found");
      }
      const user = JSON.parse(userData);

      console.log('Fetching requests for user:', user.uid);

      const response = await fetch(`http://10.10.24.70:5000/api/swap-requests?userId=${user.uid}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch requests");
      }

      const requests = await response.json();
      console.log('Received requests:', requests);
      setRequests(requests);
    } catch (error) {
      console.error("Error loading requests:", error);
      Alert.alert("Error", "Failed to load requests. Please try again.");
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleAccept = async (requestId: string) => {
    try {
      console.log('Accepting request:', requestId);
      const response = await fetch(`http://10.10.24.70:5000/api/swap-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept request");
      }

      await loadRequests();
      Alert.alert("Success", "Request accepted successfully!");
    } catch (error) {
      console.error("Error accepting request:", error);
      Alert.alert("Error", "Failed to accept request. Please try again.");
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      console.log('Declining request:', requestId);
      const response = await fetch(`http://10.10.24.70:5000/api/swap-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to decline request");
      }

      await loadRequests();
      Alert.alert("Success", "Request declined successfully!");
    } catch (error) {
      console.error("Error declining request:", error);
      Alert.alert("Error", "Failed to decline request. Please try again.");
    }
  };

  const filteredRequests = requests.filter(request => request.status === selectedTab.toLowerCase());

  const renderCard = ({ item }: { item: RequestItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.requesterName)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.requesterName}</Text>
          <Text style={styles.country}>India</Text>
        </View>
        <Text style={styles.phone}>{item.requesterContact}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.detail}>Product Name: {item.productName}</Text>
          <Text style={styles.detail}>City: {item.city}</Text>
          <Text style={styles.detail}>Pincode: {item.pincode}</Text>

          {selectedTab === "Pending" && (
            <View style={styles.buttonsRow}>
              <TouchableOpacity 
                style={styles.acceptBtn}
                onPress={() => handleAccept(item._id)}
              >
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.declineBtn}
                onPress={() => handleDecline(item._id)}
              >
                <Text style={styles.declineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Image source={{ uri: item.imageUri }} style={styles.productImage} />
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

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 100 }}>
            <Text style={{ color: "gray", fontSize: 16 }}>No {selectedTab} requests</Text>
          </View>
        }
      />
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
