import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Linking,
  ActivityIndicator,
} from "react-native";
import { fetchLeaderboardApi } from "@/app/api/api";
import { Restaurant } from "@/types";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "@assets/colors";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<Boolean>(false)
  const router = useRouter();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetchLeaderboardApi();
      if (response.success) {
        setLeaderboard(response.data || []);
      } else {
        console.error("Failed to fetch leaderboard:", response.error);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = (name: string) => {
    const query = encodeURIComponent(name);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/leaderboards.jpeg")}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <FontAwesome5 name="angle-left" style={styles.back} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <FontAwesome5 name="crown" style={styles.crown}/>
          <Text style={styles.title}>Leaderboards</Text>
          <FontAwesome5 name="crown" style={styles.crown}/>
        </View>
        {loading ? (<ActivityIndicator size="small" color="white" />): (<View style={styles.container}>
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.restaurantContainer}>
                <TouchableOpacity onPress={() => openGoogleMaps(item.name)}>
                  <Text style={styles.restaurantName}>{item.name}</Text>
                </TouchableOpacity>
                <Text style={styles.upvotes}>Upvotes: {item.upvotes}</Text>
              </View>
            )}
          />
        </View>)}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  back: {
    fontSize: 24,
    marginRight: 10,
    color: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: colors.primary400,
  },
  crown: {
    fontSize: 24,
    color: "orange",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "transparent",
  },
  restaurantContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  upvotes: {
    fontSize: 14,
    color: "#999",
  },
});
