import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContextProvider } from "@/providers/AuthProvider";
import * as Linking from "expo-linking";
import { createResturantApi, updateGroupRecommendationsApi } from "@/app/api/api";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  googleMapsLink: string;
  website: string;
}



const GrpRecommendations: React.FC = () => {
  const router = useRouter();
  const { places, roomId } = useLocalSearchParams() as { places: string, roomId: string };
  console.log(roomId);
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

  useEffect(() => {

    const addEntry = async (name: string, placeId: string) => {
      try {
        const response = await createResturantApi(placeId, name);
        console.log('Restaurant entry created:', response);
      } catch (error) {
        console.error('Error creating restaurant entry:', error);
      }
    };
  
    const updateGroupRecommendations = async (roomId: string, placeId: string) => {
      try {
        const response = await updateGroupRecommendationsApi(roomId, placeId);
        console.log('Recommendation updated:', response);
      } catch (error) {
        console.error('Error updating recommendations:', error);
      }
    };
  
    addEntry(randomPlace.name, randomPlace.place_id);
    updateGroupRecommendations(roomId, randomPlace.place_id);
  }, [])

  const randomPlace =
    parsedPlaces[Math.floor(Math.random() * parsedPlaces.length)];

  const handleOpenLink = (url: string) => {
    if (url && url.startsWith("http")) {
      Linking.openURL(url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    } else {
      Alert.alert("Invalid URL", "The URL is not valid or empty.");
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/RecoBackground.jpeg")} // Path to your new background image
      style={styles.background}
    >
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
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOpenLink(randomPlace.googleMapsLink)}
              >
                <Text style={styles.buttonText}>Open in Google Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleOpenLink(randomPlace.website)}
              >
                <Text style={styles.buttonText}>Visit Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
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
    color: "#fff", // Adjust the color to make it visible on the background
  },
  recommendationContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent background to the container
    padding: 20,
    borderRadius: 10,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000", // Changed to a darker color
  },
  placeItem: {
    padding: 30,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    width: "90%",
    alignItems: "center",
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  placeAddress: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6495ED",
    padding: 10,
    borderRadius: 5,
    marginVertical: 13,
    width: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const WrappedGrpRecommendations = () => (
  <AuthContextProvider>
    <GrpRecommendations />
  </AuthContextProvider>
);

export default WrappedGrpRecommendations;
