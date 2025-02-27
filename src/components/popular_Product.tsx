import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import MasonryList from "reanimated-masonry-list";
import { useTheme } from "@react-navigation/native";

import Icons from "@expo/vector-icons/MaterialIcons";

type PopularProductProps = {
  navigation?: any;
  handleFavourite?: (id: number) => void;
  data?: any[];
};

const PopularProduct = ({ navigation, data }: PopularProductProps) => {
  const { colors } = useTheme();

  return (
    <MasonryList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate("Details", {
              id: item.product_id,
              imageUrl: item.thumbnail,
              title: item.title,
            })
          }
        >
          {/* Image Section */}
          <Image
            source={{ uri: item.thumbnail }}
            style={[styles.productImage]}
            resizeMode="cover"
            loading="eager"
          />

          {/* Text Content Section */}
          <View style={styles.textContent}>
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.productPrice}>$ {item.price}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between", 
                alignItems: "center", 
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                }}
              >
                <Icons name="favorite" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "red",
                }}
              >
                {" "}
                {item.likes_count}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      onEndReachedThreshold={0.1}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginHorizontal: 12,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 8,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  textContent: {
    padding: 12,
    paddingHorizontal: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
});

export default PopularProduct;
