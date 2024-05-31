import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
}

const Recommendations: React.FC = () => {
  const router = useRouter();
  const { places } = useLocalSearchParams() as { places: string };
  const parsedPlaces: Place[] = JSON.parse(places);

  return (
    <View style={styles.container}>
      <FontAwesome
        name="long-arrow-left"
        style={styles.back}
        onPress={() => router.push("/(tabs)")}
      />
      <FlatList
        data={parsedPlaces}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <View style={styles.placeItem}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.vicinity}</Text>
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
    padding: 10,
  },
  back: {
    fontSize: 24,
    padding: 10,
  },
  placeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  placeAddress: {
    fontSize: 14,
    color: "#555",
  },
});

export default Recommendations;
