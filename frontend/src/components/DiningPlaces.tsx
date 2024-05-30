import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useRouter } from "expo-router";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
}

const DiningPlaces: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  ); // stores the user's current lat and lng as an object. initially set to null.
  const [places, setPlaces] = useState<Place[]>([]); // stores an array of restaurants fetched from places API. initially set to an empty array.
  const [loading, setLoading] = useState(false); // if data loaded or not
  const router = useRouter();

  useEffect(() => {
    requestLocationPermission();
  }, []); // hook that runs when com mounts => ask user for location permissions

  // asking user for location permissions
  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  // use user curr location and get restauarants within 5km radius
  const fetchRecommendations = async () => {
    if (!location) {
      alert("Unable to fetch location. Please try again.");
      return;
    }

    const { lat, lng } = location;
    const radius = 5000; // 5 km radius

    setLoading(true);

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${lat},${lng}`,
            radius,
            type: "restaurant",
            key: "AIzaSyBsZsI8YQPYyEDGh1sPhaTeu4wNhRXvk3Y",
          },
        }
      );
      const places: Place[] = response.data.results.map((result: any) => ({
        place_id: result.place_id,
        name: result.name,
        vicinity: result.vicinity,
      }));
      setPlaces(places);
      //   router.push(
      //     `/Recommendations?places=${encodeURIComponent(JSON.stringify(places))}`
      //   );
      router.push({
        pathname: "/(tabs)/Recommendations",
        params: { places: JSON.stringify(places) },
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.recommendations}>Dining Places Recommendation</Text>
      <TouchableOpacity
        style={styles.recommendButton}
        onPress={fetchRecommendations}
        disabled={loading}
      >
        <Text style={styles.recommendButtonText}>Recommend now!!!</Text>
      </TouchableOpacity>
      {/* {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View style={styles.placeItem}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddress}>{item.vicinity}</Text>
            </View>
          )}
        />
      )} */}
    </View>
  );
}; // display results in flatlist, for now just text later can change to clickables

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  recommendations: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "Inter",
    fontWeight: "300",
    paddingBottom: 10,
  },
  recommendButton: {
    backgroundColor: "#001f3f",
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  recommendButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default DiningPlaces;
