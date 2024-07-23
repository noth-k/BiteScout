import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@assets/colors';
import { useAuthContext } from '@/providers/AuthProvider';
import { Restaurant } from '@/types';
import { useUpvoteContext } from '@/providers/UpvoteProvider';
import { fetchRestaurantDetailsById, fetchUserRecommendatedResturantsApi, fetchUserUpvotedRestaurantsApi, upvoteRestaurantApi } from '@/app/api/api';

const history = () => {
    const router = useRouter();
    const [selected, setSelected] = useState<String>("Past");
    const { user } = useAuthContext();
    const { upvotedRestaurants, setUpvotedRestaurants, toggleUpvote } =
    useUpvoteContext();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [recommendations, setRecommendations] = useState<Restaurant[]>([]);

    useEffect(() => {
        fetchUpvotedRestaurants();
        fetchRecommendedRestaurants();
      }, [refresh]);

      const fetchRecommendedRestaurants = async () => {
        if (!user || !user._id) return;
        try {
          setLoading(true);
          const response = await fetchUserRecommendatedResturantsApi(user._id);
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
    
            setRecommendations(validRestaurants);
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
    <SafeAreaView style={{backgroundColor:"white", height:'100%'}}>
        <View style={styles.header}>
            <FontAwesome
                name="angle-left"
                style={styles.back}
                onPress={() => router.back()}
            />
            <Text style={styles.title}>History</Text>
            <FontAwesome
                name="refresh"
                style={styles.back}
                onPress={() => setRefresh(refresh+1)}
            />

        </View>

        <View style={styles.selectedContainer}>
            <TouchableOpacity style={selected == "Past" ? styles.selectedHighlight : styles.selected} onPress={() => setSelected("Past")}> 
                <Text style={selected == "Past" ? styles.selectedText : styles.selectedTextSelection}>Past</Text>
            </TouchableOpacity>

            <TouchableOpacity style={selected == "Upvoted" ? styles.selectedHighlight : styles.selected} onPress={() => setSelected("Upvoted")}>
                <Text style={selected == "Upvoted" ? styles.selectedText : styles.selectedTextSelection}>Upvoted</Text>
            </TouchableOpacity>
        </View>

        {selected === "Upvoted" && (
        loading ? (
            <ActivityIndicator size="small" color="lightgrey" style={{marginTop:"50%"}} />
        ) : (
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
        )
        )}

        {selected === "Past" && (
        loading ? (
            <ActivityIndicator size="small" color="lightgrey" style={{marginTop:"50%"}} />
        ) : (
            <FlatList
            data={recommendations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.restaurantContainer}>
                    <Text style={styles.restaurantName}>{item.name}</Text>
                    <Text style={styles.restaurantVicinity}>{item.vicinity}</Text>
                </View>
            )}
            />
        )
        )}
      
    </SafeAreaView>
  )
}

export default history;


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      },
      title: {
        fontFamily: 'Inter',
        fontSize: 20,
        fontWeight: 'bold',
        flex:1,
        marginLeft:"34%",
      },
      back: {
        fontSize: 24,
        padding: 10,
      },
      selectedContainer: {
        flexDirection:"row",
        borderRadius: 10,
        borderWidth:1,
        borderColor:"lightgrey",
        marginVertical:20,
        alignSelf:"center",
      },
      selected: {
        padding:12,
        width:90,
      },

      selectedHighlight: {
        backgroundColor:colors.primary400,
        padding:12,
        width:90,
        borderColor:"lightgrey",
        borderRadius:10,
        borderWidth:1,
        shadowColor: 'black',
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      selectedText: {
        fontFamily: 'Inter',
        textAlign:"center",
        color: "white"
      },
      selectedTextSelection: {
        fontFamily: 'Inter',
        textAlign:"center",
        color: "black"
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
        height:40, 
        justifyContent:"center",
      },
      upvoteButtonText: {
        color: "#fff",
        fontSize: 14,
      },

})