import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios, { AxiosError } from "axios";
import { Ionicons } from "@expo/vector-icons";

// Define the type for Product
interface Product {
  _id: string;
  productName: string;
  wants: string;
  city: string;
  imageUris: string[];
}

const CategoryProductsScreen = () => {
  const { category } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]); // State with the Product type
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]); // List of product IDs
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false); // Modal state (if needed later)

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
    }
  }, [category]);

  const toggleWishlist = (item: Product) => {
    if (wishlist.includes(item._id)) {
      setWishlist((prev) => prev.filter((id) => id !== item._id));
    } else {
      setWishlist((prev) => [...prev, item._id]);
    }
  };

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
              onPress={() => setIsSwapModalVisible(true)}
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
