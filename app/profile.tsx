import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const location = "India";

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, []);

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(" ");
    return names.length === 1
      ? names[0][0].toUpperCase()
      : (names[0][0] + names[1][0]).toUpperCase();
  };

  const initials = user?.fullName ? getInitials(user.fullName) : "";

  const handleLogout = () => {
    router.replace("/sign-in");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.background}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <BlurView intensity={20} style={styles.backBlur}>
          <Ionicons name="arrow-back" size={24} color="#7E4DD1" />
        </BlurView>
      </TouchableOpacity>

      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Text style={styles.name}>{user?.fullName || "User"}</Text>
            <Text style={styles.location}>{location}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuItem icon={<FontAwesome5 name="star" size={18} color="black" />} label="Swap Score" />
          <MenuItem icon={<Ionicons name="information-circle-outline" size={20} color="black" />} label="Account Information" />
          <MenuItem icon={<Ionicons name="lock-closed-outline" size={20} color="black" />} label="Password" />
          <MenuItem icon={<FontAwesome5 name="exchange-alt" size={18} color="black" />} label="My Swaps" />
          <MenuItem
            icon={<Ionicons name="heart-outline" size={20} color="black" />}
            label="Wishlist"
            onPress={() => router.push("/wishlist")}
          />
          <MenuItem icon={<Ionicons name="settings-outline" size={20} color="black" />} label="Settings" />
        </View>

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Entypo name="log-out" size={20} color="red" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const MenuItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {icon}
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
  

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#E3DFFD",
    alignItems: "center",
    justifyContent: "center",
  },
  blurContainer: {
    width: width * 0.9,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: "#7E4DD1",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    color: "gray",
  },
  menu: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuLabel: {
    marginLeft: 15,
    fontSize: 15,
    color: "#333",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    alignSelf: "flex-start",
  },
  logoutText: {
    marginLeft: 10,
    color: "red",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 40,
    zIndex: 999,
  },
  backBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});

export default ProfileScreen;
