import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  fetchUserUpvotedRestaurantsApi,
  fetchRestaurantDetailsById,
  upvoteRestaurantApi,
} from "@/app/api/api";
import { useAuthContext } from "@/providers/AuthProvider";
import { UpvoteProvider, useUpvoteContext } from "@/providers/UpvoteProvider"; // Import the context
import { Restaurant } from "@/types";
import colors from "@assets/colors";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const UpvotedRestaurantsComponent = () => {
  const { user } = useAuthContext();
  const { upvotedRestaurants, setUpvotedRestaurants, toggleUpvote } =
    useUpvoteContext();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUpvotedRestaurants();
  }, []);

  const fetchUpvotedRestaurants = async () => {
    if (!user || !user._id) return;
    try {
      setLoading(true);
      const response = await fetchUserUpvotedRestaurantsApi(user._id);
      if (response.success) {
        const restaurantDetails = await Promise.all(
          (response.data || []).map((id) =>
            fetchRestaurantDetailsById(id)
              .then((res) => (res.success ? res.data : null))
              .catch(() => null)
          )
        );

        const validRestaurants = restaurantDetails.filter(
          (res): res is Restaurant => res !== null
        );

        setRestaurants(validRestaurants);
        setUpvotedRestaurants(response.data || []);
      } else {
        Alert.alert(
          "Error",
          response.error || "Failed to fetch upvoted restaurants."
        );
      }
    } catch (error) {
      console.error("Failed to fetch upvoted restaurants:", error);
      Alert.alert("Error", "Failed to fetch upvoted restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const undoUpvote = async (restaurantId: string, restaurantName: string) => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const response = await upvoteRestaurantApi(
        restaurantId,
        restaurantName,
        user._id
      );
      if (response.success) {
        toggleUpvote(restaurantId);
        setRestaurants((prevRestaurants) =>
          prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
        );
        setUpvotedRestaurants((prevUpvoted) =>
          prevUpvoted.filter((id) => id !== restaurantId)
        );
      } else {
        Alert.alert("Error", response.error || "Failed to undo upvote.");
      }
    } catch (error) {
      console.error("Failed to undo upvote:", error);
      Alert.alert("Error", "Failed to undo upvote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="angle-left" style={styles.back} />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color={colors.primary400} />}
      {!loading && (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.restaurantContainer}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text style={styles.restaurantVicinity}>{item.vicinity}</Text>
              <TouchableOpacity
                style={styles.upvoteButton}
                onPress={() => undoUpvote(item.id, item.name)}
              >
                <Text style={styles.upvoteButtonText}>Undo Upvote</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const UpvotedRestaurants = () => (
  <UpvoteProvider>
    <UpvotedRestaurantsComponent />
  </UpvoteProvider>
);

export default UpvotedRestaurants;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 15,
  },
  back: {
    fontSize: 30,
    color: colors.primary400,
  },
  restaurantContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  restaurantVicinity: {
    fontSize: 16,
    color: "#666",
  },
  upvoteButton: {
    backgroundColor: colors.primary400,
    padding: 5,
    marginTop: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  upvoteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
