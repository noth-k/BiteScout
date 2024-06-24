import {
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/Themed";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import DiningPlaces from "@/components/DiningPlaces";
import colors from "@assets/colors";
import { AuthContextProvider } from "@/providers/AuthProvider";

type Vibe = {
  name: String;
};

const vibes: Vibe[] = [
  { name: "Cozy" },
  { name: "Modern" },
  { name: "Casual" },
  { name: "Elegant" },
  { name: "Lively" },
  { name: "Scenic" },
  { name: "Authentic" },
  { name: "Convenient" },
];

const priceOptions = [
  "Any price",
  "Less than $10",
  "Less than $20",
  "Less than $50",
];

export default function App() {
  const [vibe, setVibe] = useState("");
  const [price, setPrice] = useState("");

  return (
    <AuthContextProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Discover Food through Vibes...</Text>
            <View style={styles.vibesContainer}>
              <FlatList
                data={vibes}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setVibe(`${item.name}`)}
                    style={[
                      styles.vibeButton,
                      vibe === item.name && styles.selectedVibeButton,
                    ]}
                  >
                    <Text style={styles.vibeButtonText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                numColumns={2}
                contentContainerStyle={{
                  gap: 20,
                }}
                columnWrapperStyle={{ justifyContent: "space-between" }}
              />
            </View>
            <Text style={styles.price}>Price Range</Text>
            <View style={styles.priceOptionsContainer}>
              {priceOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.priceOption,
                    price === option && styles.selectedPriceOption,
                  ]}
                  onPress={() => setPrice(option)}
                >
                  <Text style={styles.priceOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <DiningPlaces selectedPrice={price} />
            {vibe != "" && (
              <Text style={{ color: "red", fontSize: 15 }}>
                Selected: {vibe}
              </Text>
            )}
            {price != "" && (
              <Text style={{ color: "red", fontSize: 15, paddingBottom: 20 }}>
                Selected: {price}
              </Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: "5%",
  },
  title: {
    fontSize: 35,
    fontFamily: "Inter",
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  vibesContainer: {
    marginBottom: 20,
  },
  vibeButton: {
    backgroundColor: "#d3d3d3",
    padding: 12,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  selectedVibeButton: {
    backgroundColor: "#001f3f",
  },
  vibeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  price: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "400",
    marginBottom: 10,
    alignSelf: "center",
  },
  priceOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  priceOption: {
    backgroundColor: "#d3d3d3",
    padding: 12,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedPriceOption: {
    backgroundColor: "#001f3f",
  },
  priceOptionText: {
    color: "#fff",
    fontSize: 16,
  },
});
