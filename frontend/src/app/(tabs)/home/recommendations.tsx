import React, { useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContextProvider } from "@/providers/AuthProvider";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
}

const Recommendations: React.FC = () => {
  const router = useRouter();
  const { places } = useLocalSearchParams() as { places: string };
  const parsedPlaces: Place[] = JSON.parse(places);

  useEffect(() => {
    if (parsedPlaces.length === 0) {
      Alert.alert(
        "No matches found",
        "Please adjust search filters and try again!"
      );
      router.back();
    }
  }, [parsedPlaces, router]);

  const randomPlace =
    parsedPlaces[Math.floor(Math.random() * parsedPlaces.length)];

  return (
    <View style={styles.container}>
      <FontAwesome
        name="angle-left"
        style={styles.back}
        onPress={() => router.back()}
      />
      {parsedPlaces.length > 0 && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.header}>
            We recommend you try the following restaurant!
          </Text>
          <View style={styles.placeItem}>
            <Text style={styles.placeName}>{randomPlace.name}</Text>
            <Text style={styles.placeAddress}>{randomPlace.vicinity}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  back: {
    fontSize: 24,
    paddingTop: 40,
    paddingHorizontal: 10,
    position: "absolute",
    top: 20,
    left: 10,
  },
  recommendationContainer: {
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  placeItem: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "100%",
    alignItems: "center",
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  placeAddress: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
});

const WrappedRecommendations = () => (
  <AuthContextProvider>
    <Recommendations />
  </AuthContextProvider>
);

export default WrappedRecommendations;
