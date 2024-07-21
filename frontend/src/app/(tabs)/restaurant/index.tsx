import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import {
  searchRestaurantsApi,
  upvoteRestaurantApi,
  fetchUserUpvotedRestaurantsApi,
} from "@/app/api/api";
import colors from "@assets/colors";
import { Restaurant } from "@/types";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/providers/AuthProvider";
import { UpvoteProvider, useUpvoteContext } from "@/providers/UpvoteProvider"; // Import the context
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for the reload icon

const RestaurantsComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuthContext();
  const { upvotedRestaurants, toggleUpvote, setUpvotedRestaurants } =
    useUpvoteContext(); // Use the context

  useEffect(() => {
    if (user) {
      fetchUpvotedRestaurants();
    }
  }, [user]);

  useEffect(() => {
    // Refetch restaurants when upvotedRestaurants changes
    fetchUpvotedRestaurants();
  }, [upvotedRestaurants]);

  const fetchUpvotedRestaurants = async () => {
    if (!user || !user._id) return;
    try {
      // console.log("Fetching upvoted restaurants for user:", user._id);
      const response = await fetchUserUpvotedRestaurantsApi(user._id);
      // console.log("Upvoted restaurants response:", response);
      if (response.success) {
        setUpvotedRestaurants(response.data || []);
      } else {
        console.error("Failed to fetch upvoted restaurants:", response.error);
      }
    } catch (error) {
      console.error("Failed to fetch upvoted restaurants:", error);
    }
  };

  const searchRestaurants = async () => {
    setLoading(true);
    try {
      console.log("Searching for restaurants with term:", searchTerm);
      const response = await searchRestaurantsApi(searchTerm);
      console.log("Search restaurants response:", response);
      if (response.success && response.data && Array.isArray(response.data)) {
        const fetchedRestaurants = response.data.map((place: any) => ({
          id: place.id,
          name: place.name,
          vicinity: place.vicinity,
          upvotes: place.upvotes,
          isUpvoted: upvotedRestaurants.includes(place.id), // Check if the restaurant is upvoted
        }));
        console.log("Fetched restaurants:", fetchedRestaurants);
        setRestaurants(fetchedRestaurants);
      } else {
        console.error("Failed to search restaurants:", response.error);
        Alert.alert(
          "Search Error",
          response.error || "Failed to search restaurants."
        );
      }
    } catch (error) {
      console.error("Failed to search restaurants:", error);
      Alert.alert(
        "Search Error",
        error instanceof Error ? error.message : "Failed to search restaurants."
      );
    } finally {
      setLoading(false);
    }
  };

  const upvoteRestaurant = async (id: string, name: string) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to upvote.");
      return;
    }

    try {
      console.log("Upvoting restaurant:", id, name);
      const restaurant = restaurants.find((r) => r.id === id);
      if (!restaurant) return;

      const response = await upvoteRestaurantApi(id, name, user._id);
      console.log("Upvote restaurant response:", response);
      if (response.success) {
        toggleUpvote(id); // Toggle the upvote state in the context
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === id
              ? {
                  ...restaurant,
                  upvotes: restaurant.isUpvoted
                    ? restaurant.upvotes - 1
                    : restaurant.upvotes + 1,
                  isUpvoted: !restaurant.isUpvoted,
                }
              : restaurant
          )
        );
      } else {
        Alert.alert(
          "Upvote Error",
          response.error || "Failed to upvote restaurant"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Upvote Error",
        error.message || "Failed to upvote restaurant"
      );
      console.error("Failed to upvote restaurant:", error);
    }
  };

  const navigateToLeaderboard = () => {
    router.push({
      pathname: "/(tabs)/restaurant/leaderboards",
    });
  };

  const handleReload = async () => {
    await fetchUpvotedRestaurants();
    await searchRestaurants();
  };

  const openGoogleMaps = (name: string) => {
    const query = encodeURIComponent(name);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Restaurants</Text>
        <TouchableOpacity onPress={handleReload}>
          <FontAwesome name="refresh" style={styles.reloadIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter restaurant name"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={searchRestaurants}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>

        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.restaurantContainer}>
              <TouchableOpacity onPress={() => openGoogleMaps(item.name)}>
                <Text style={styles.restaurantName}>{item.name}</Text>
              </TouchableOpacity>
              <Text style={styles.restaurantVicinity}>{item.vicinity}</Text>
              <Text style={styles.upvotes}>Upvotes: {item.upvotes}</Text>
              <TouchableOpacity
                onPress={() => upvoteRestaurant(item.id, item.name)}
                style={[
                  styles.upvoteButton,
                  item.isUpvoted && styles.upvotedButton,
                ]}
              >
                <Text style={styles.upvoteButtonText}>
                  {item.isUpvoted ? "Undo Upvote" : "Upvote"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.leaderboardButton}
          onPress={navigateToLeaderboard}
        >
          <Text style={styles.leaderboardButtonText}>Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Restaurants = () => (
  <UpvoteProvider>
    <RestaurantsComponent />
  </UpvoteProvider>
);

export default Restaurants;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 10,
    paddingLeft: 60,
  },
  reloadIcon: {
    fontSize: 24,
    color: colors.primary400,
    paddingTop: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: colors.primary400,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  restaurantContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  restaurantVicinity: {
    fontSize: 16,
    color: "#666",
  },
  upvotes: {
    fontSize: 14,
    color: "#999",
  },
  upvoteButton: {
    backgroundColor: colors.primary400,
    padding: 5,
    marginTop: 5,
    alignItems: "center",
    borderRadius: 5,
  },
  upvotedButton: {
    backgroundColor: colors.primary700, // Change to a different color when upvoted
  },
  upvoteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  leaderboardButton: {
    backgroundColor: colors.primary400,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  leaderboardButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
