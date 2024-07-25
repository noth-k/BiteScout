import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/providers/AuthProvider";
import {
  fetchRoomData,
  getMajorityChoice,
  combineRestrictions,
} from "../app/utils/roomUtils";
import colors from "@assets/colors";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  reviews: string;
  description: string;
  website: string;
  types: string[];
  price_level: number;
  googleMapsLink: string; // Added googleMapsLink attribute
}

interface GroupRecoProps {
  roomId: string;
}

const GroupReco: React.FC<GroupRecoProps> = ({ roomId }) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const vibes: { [key: string]: string[] } = {
    Cozy: [
      "intimate",
      "warm",
      "comfortable",
      "snug",
      "homely",
      "welcoming",
      "friendly",
      "relaxed",
      "quiet",
      "charming",
      "cozy",
    ],
    Modern: [
      "contemporary",
      "sleek",
      "stylish",
      "minimalist",
      "innovative",
      "trendy",
      "urban",
      "cutting-edge",
      "sophisticated",
      "fashionable",
      "modern",
    ],
    Casual: [
      "laid-back",
      "informal",
      "easygoing",
      "relaxed",
      "comfortable",
      "unpretentious",
      "friendly",
      "chill",
      "simple",
      "down-to-earth",
      "casual",
    ],
    Elegant: [
      "classy",
      "refined",
      "sophisticated",
      "chic",
      "graceful",
      "luxurious",
      "stylish",
      "polished",
      "posh",
      "upscale",
      "elegant",
    ],
    Lively: [
      "vibrant",
      "bustling",
      "energetic",
      "exciting",
      "dynamic",
      "upbeat",
      "animated",
      "fun",
      "spirited",
      "active",
      "lively",
    ],
    Scenic: [
      "picturesque",
      "beautiful",
      "breathtaking",
      "panoramic",
      "charming",
      "lovely",
      "stunning",
      "gorgeous",
      "aesthetic",
      "idyllic",
      "scenic",
    ],
    Authentic: [
      "genuine",
      "traditional",
      "real",
      "original",
      "classic",
      "cultural",
      "historic",
      "true",
      "legitimate",
      "local",
      "authentic",
    ],
    Convenient: [
      "accessible",
      "handy",
      "practical",
      "nearby",
      "easy",
      "efficient",
      "quick",
      "simple",
      "comfortable",
      "useful",
      "convenient",
    ],
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
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
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const fetchNearbyPlaces = async (
    lat: number,
    lng: number,
    radius: number,
    keyword: string | null
  ) => {
    const params: any = {
      location: `${lat},${lng}`,
      radius,
      type: "restaurant",
      key: "AIzaSyD7KpFMQMMe2Ry6MC_q6_286QSdjt2Lvvc", // Replace with your API key
    };

    if (keyword && keyword.toLowerCase() !== "nil") {
      params.keyword = keyword;
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params,
        timeout: 30000,
      }
    );

    console.log(
      `Fetched ${response.data.results.length} places for radius ${radius}m with keyword "${keyword}"`
    );

    return response.data.results.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
    }));
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: "AIzaSyD7KpFMQMMe2Ry6MC_q6_286QSdjt2Lvvc", // Replace with your API key
        },
        timeout: 50000,
      }
    );

    const result = response.data.result;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`;
    return {
      place_id: result.place_id,
      name: result.name,
      vicinity: result.vicinity,
      reviews: result.reviews
        ? result.reviews.map((review: any) => review.text).join(" ")
        : "",
      description: result.editorial_summary
        ? result.editorial_summary.overview
        : "",
      website: result.website || "",
      types: result.types || [],
      price_level: result.price_level || 0,
      googleMapsLink, // Added googleMapsLink attribute
    };
  };

  const fetchGroupRecommendations = async () => {
    if (!location) {
      alert("Unable to fetch location. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const roomData = await fetchRoomData(roomId);
      console.log("Room Data:", roomData);

      const majorityVibe = getMajorityChoice(roomData.vibes || []);
      const majorityPrice = getMajorityChoice(roomData.price || []);
      const combinedRestrictions = combineRestrictions(
        roomData.restrictions || []
      ).filter((restriction) => restriction.toLowerCase() !== "nil");
      console.log("Majority Vibe:", majorityVibe);
      console.log("Majority Price:", majorityPrice);
      console.log("Combined Restrictions (filtered):", combinedRestrictions);

      const { lat, lng } = location;

      // Fetch results with different radii using combined restrictions as the keyword
      const fetchPlacesWithRestrictions = async (radius: number) => {
        if (combinedRestrictions.length === 0) {
          // Fetch without any restrictions if all are "nil"
          return await fetchNearbyPlaces(lat, lng, radius, null);
        } else {
          // Fetch with each restriction
          const places = await Promise.all(
            combinedRestrictions.map((restriction) =>
              fetchNearbyPlaces(lat, lng, radius, restriction)
            )
          );
          return places.flat();
        }
      };

      const radius1km = await fetchPlacesWithRestrictions(1000);
      const radius2km = await fetchPlacesWithRestrictions(2000);
      const radius4km = await fetchPlacesWithRestrictions(4000);
      const radius5km = await fetchPlacesWithRestrictions(5000);

      // Combine and remove duplicates
      const allPlaces = [
        ...radius1km,
        ...radius2km,
        ...radius4km,
        ...radius5km,
      ];
      const uniquePlaces = Array.from(
        new Map(allPlaces.map((place) => [place.place_id, place])).values()
      );

      const detailedPlaces = await Promise.all(
        uniquePlaces.map((place) => fetchPlaceDetails(place.place_id))
      );

      const filteredPlacesByRestriction = filterPlacesByRestrictions(
        detailedPlaces,
        combinedRestrictions
      );

      const filteredPlacesByPrice = filterPlacesByPrice(
        filteredPlacesByRestriction,
        majorityPrice
      );

      const finalFilteredPlaces = filterPlacesByVibe(
        filteredPlacesByPrice,
        majorityVibe
      );

      router.push({
        pathname: "/(tabs)/rooms/grprecommendations",
        params: { 
          places: JSON.stringify(finalFilteredPlaces),
          roomId: roomId,
         },
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterPlacesByVibe = (places: Place[], selectedVibe: string) => {
    console.log("Selected Vibe:", selectedVibe);
    // console.log("Places before Vibe filter:", places);

    if (!selectedVibe) return places;

    const keywords = vibes[selectedVibe] || [];
    const keywordsLower = keywords.map((keyword) => keyword.toLowerCase());

    const filteredPlaces = places.filter((place) => {
      const reviews = place.reviews?.toLowerCase() || "";
      const description = place.description?.toLowerCase() || "";
      const website = place.website?.toLowerCase() || "";
      const types = place.types?.join(" ").toLowerCase() || "";
      const name = place.name?.toLowerCase() || "";
      const vicinity = place.vicinity?.toLowerCase() || "";
      return keywordsLower.some((keyword) =>
        [reviews, description, website, types, name, vicinity].some((text) =>
          text.includes(keyword)
        )
      );
    });

    // console.log("Places after Vibe filter:", filteredPlaces);
    return filteredPlaces;
  };

  const filterPlacesByPrice = (places: Place[], selectedPrice: string) => {
    console.log("Selected Price:", selectedPrice);
    // console.log("Places before Price filter:", places);

    const filteredPlaces = places.filter((place) => {
      switch (selectedPrice) {
        case "Less than $10":
          return place.price_level !== undefined && place.price_level <= 1;
        case "Less than $20":
          return place.price_level !== undefined && place.price_level <= 2;
        case "Less than $50":
          return place.price_level !== undefined && place.price_level <= 3;
        default:
          return true;
      }
    });

    // console.log("Places after Price filter:", filteredPlaces);
    return filteredPlaces;
  };

  const filterPlacesByRestrictions = (
    places: Place[],
    restrictions: string[]
  ) => {
    console.log("Restrictions:", restrictions);
    // console.log("Places before Restrictions filter:", places);

    if (!restrictions || restrictions.length === 0) return places;

    const filteredPlaces = places.filter((place) => {
      const reviews = place.reviews?.toLowerCase() || "";
      const description = place.description?.toLowerCase() || "";
      const website = place.website?.toLowerCase() || "";
      const types = place.types?.join(" ").toLowerCase() || "";
      const name = place.name?.toLowerCase() || "";
      const vicinity = place.vicinity?.toLowerCase() || "";
      return restrictions.every((restriction) =>
        [reviews, description, website, types, name, vicinity].some((text) =>
          text.includes(restriction.toLowerCase())
        )
      );
    });

    // console.log("Places after Restrictions filter:", filteredPlaces);
    return filteredPlaces;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.recommendButton}
        onPress={fetchGroupRecommendations}
      >
        {!loading && (
          <Text style={styles.recommendButtonText}>Group Recommend</Text>
        )}
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 20,
  },
  recommendButton: {
    backgroundColor: "white",
    width: "85%",
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recommendButtonText: {
    color: colors.primary400,
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "400",
  },
});

export default GroupReco;
