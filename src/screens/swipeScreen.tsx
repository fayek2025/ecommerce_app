import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator, Dimensions, Alert, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/auth/useAuthStore";

const { width, height } = Dimensions.get("window");

interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  is_active: boolean;
  created_at: string;
}

interface Product {
  product_id: number;
  title: string;
  description: string;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  brand: Brand;
  thumbnail: string;
  images: string[];
  is_published: boolean;
  category_id: number;
  brand_id: number;
  gender: string;
  sizes: string[];
}

interface SwipeScreenProps {}

const SwipeScreen: React.FC<SwipeScreenProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [previousCards, setPreviousCards] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [token, setToken] = useState<string>(useAuthStore.getState().refreshToken);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setFetchComplete(false);
      setFetchError(false);
      setPreviousCards(products);
      const response = await axios.get(
        "https://6ad2-2a09-bac1-b20-518-00-3c2-2c.ngrok-free.app/feedback/swipe?limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProducts(response.data.data || []);
      setCurrentIndex(0); // Reset the current index when new products are fetched
    } catch (error) {
      console.error("Error fetching products:", error.message);
      Alert.alert("Error", "Unable to fetch products. Please try again later.");
      setFetchError(true); // Set fetch error to true if fetching fails
    } finally {
      setLoading(false);
      setFetchComplete(true);
    }
  };

  const refetchPreviousCards = () => {
    if (previousCards.length > 0) {
      setProducts(previousCards);
      Alert.alert("Success", "Restored the previous set of cards.");
    } else {
      Alert.alert("Error", "No previous cards to restore.");
    }
  };

  const handleFeedback = async (productId: number, liked: boolean) => {
    try {
      await axios.post(
        "https://6ad2-2a09-bac1-b20-518-00-3c2-2c.ngrok-free.app/feedback",
        {
          product_id: productId,
          liked: liked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Feedback submitted: ${liked ? "Liked" : "Disliked"} for product ${productId}`);
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      Alert.alert("Error", "Unable to submit feedback. Please try again.");
    }
  };

  const onSwipeRight = (cardIndex: number) => {
    const product = products[cardIndex];
    if (product) handleFeedback(product.product_id, true);
    setCurrentIndex(cardIndex + 1);
  };

  const onSwipeLeft = (cardIndex: number) => {
    const product = products[cardIndex];
    if (product) handleFeedback(product.product_id, false);
    setCurrentIndex(cardIndex + 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f76c6c" />
        <Text style={styles.loadingText}>Fetching products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {products.length > 0 ? (
        <Swiper
          cards={products}
          renderCard={(product: Product) => (
            <View style={styles.card}>
              <Image
                source={{ uri: product.thumbnail }}
                style={styles.image}
              />
              <Text style={styles.name}>{product.title}</Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
          )}
          onSwipedRight={onSwipeRight}
          onSwipedLeft={onSwipeLeft}
          cardIndex={0}
          backgroundColor={"#f5f5f5"}
          stackSize={3}
          verticalSwipe={false} // Disable vertical swipe
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "red",
                  color: "white",
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: "green",
                  color: "white",
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products to swipe. Try again later!</Text>
          <TouchableOpacity onPress={fetchProducts} style={styles.reloadButton}>
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.reloadText}>Reload</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={refetchPreviousCards} style={styles.reloadButton}>
            <Ionicons name="arrow-back-circle" size={24} color="white" />
            <Text style={styles.reloadText}>Refetch Previous</Text>
          </TouchableOpacity>
        </View>
      )}

      {(fetchError || currentIndex >= products.length) && (
        <TouchableOpacity onPress={fetchProducts} style={styles.refetchButton}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refetchText}>Refetch Products</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  image: {
    width: width * 0.8,
    height: height * 0.5,
    borderRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginBottom: 20,
  },
  reloadButton: {
    flexDirection: "row",
    backgroundColor: "#f76c6c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  reloadText: {
    marginLeft: 8,
    color: "white",
    fontSize: 16,
  },
  refetchButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  refetchText: {
    marginLeft: 8,
    color: "white",
    fontSize: 16,
  },
});

export default SwipeScreen;