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
import { useAuthContext } from "@/providers/AuthProvider"; // Import the authentication context
import colors from "@assets/colors";
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";
import { fetchRestaurantUpvotesApi } from "@/app/api/api";
const nlp = winkNLP(model);

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  reviews: string;
  description: string;
  website: string;
  types: string[];
  price_level: number;
  googleMapsLink: string;
}

interface Props {
  selectedPrice: string;
  selectedVibe: string;
  testID?: string;
}

const DiningPlaces: React.FC<Props> = ({
  selectedPrice,
  selectedVibe,
  testID,
}) => {
  const { user } = useAuthContext(); // Get the current user from the authentication context
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      "fancy",
      "bistro",
      "fine",
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
      key: "AIzaSyD7KpFMQMMe2Ry6MC_q6_286QSdjt2Lvvc", // use environment variable for the API key
    };

    if (keyword && keyword.toLowerCase() !== "nil") {
      params.keyword = keyword; // use the keyword only if it's not "Nil"
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
      {
        params,
        timeout: 30000, // increase timeout to 30 seconds, for bigger search radius
      }
    );

    console.log(
      `Fetched ${response.data.results.length} places for radius ${radius}m with keyword "${keyword}"`
    );

    return response.data.results.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      googleMapsLink: `https://maps.google.com/?q=${place.name}`,
    }));
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          place_id: placeId,
          key: "AIzaSyD7KpFMQMMe2Ry6MC_q6_286QSdjt2Lvvc", // use environment variable for the API key
        },
        timeout: 50000,
      }
    );

    const result = response.data.result;

    const upvotesResponse = await fetchRestaurantUpvotesApi(placeId);
    const upvotes =
      upvotesResponse.success && upvotesResponse.data
        ? upvotesResponse.data.upvotes
        : 0;

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
      googleMapsLink: `https://maps.google.com/?q=${result.name}`,
      upvotes: upvotes,
    };
  };

  const fetchRecommendations = async () => {
    if (!location) {
      alert("Unable to fetch location. Please try again.");
      return;
    }

    if (!user || !user.email) {
      alert("Unable to fetch user information. Please log in.");
      return;
    }

    const { lat, lng } = location;

    setLoading(true);

    try {
      // fetch results with different radii
      const radius1km = await fetchNearbyPlaces(
        lat,
        lng,
        1000,
        user.restrictions
      );
      const radius2km = await fetchNearbyPlaces(
        lat,
        lng,
        2000,
        user.restrictions
      );
      const radius4km = await fetchNearbyPlaces(
        lat,
        lng,
        4000,
        user.restrictions
      );
      const radius5km = await fetchNearbyPlaces(
        lat,
        lng,
        5000,
        user.restrictions
      );

      // combine and remove duplicates
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

      // console.log("Detailed places fetched:", detailedPlaces);

      const userRestrictions = user.restrictions; // Directly access user restrictions
      const filteredPlaces = filterPlacesByRestrictions(
        detailedPlaces,
        userRestrictions
      );

      const priceFilteredPlaces = filterPlacesByPrice(
        filteredPlaces,
        selectedPrice
      );

      const vibeFilteredPlaces = filterPlacesByVibe(
        priceFilteredPlaces,
        selectedVibe
      );

      // console.log("Price filtered places:", priceFilteredPlaces);

      setPlaces(vibeFilteredPlaces);

      // Navigate to Recommendations with the filtered places
      router.push({
        pathname: "/(tabs)/home/recommendations",
        params: { places: JSON.stringify(vibeFilteredPlaces) },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterPlacesByRestrictions = (
    places: Place[],
    restrictions: string
  ) => {
    if (restrictions === "Nil") {
      return places;
    }
    const restrictionsLower = restrictions.toLowerCase();
    return places.filter((place) => {
      const reviews = place.reviews || "";
      const description = place.description || "";
      const website = place.website || "";
      const types = place.types.join(" ").toLowerCase();
      const name = place.name.toLowerCase();
      const vicinity = place.vicinity.toLowerCase();
      return (
        reviews.toLowerCase().includes(restrictionsLower) ||
        description.toLowerCase().includes(restrictionsLower) ||
        website.toLowerCase().includes(restrictionsLower) ||
        types.includes(restrictionsLower) ||
        name.includes(restrictionsLower) ||
        vicinity.includes(restrictionsLower)
      );
    });
  };

  const filterPlacesByPrice = (places: Place[], selectedPrice: string) => {
    return places.filter((place) => {
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
  };

  const filterPlacesByVibe = (places: Place[], selectedVibe: string) => {
    if (!selectedVibe) return places;

    const keywords = vibes[selectedVibe] || [];
    const keywordsLower = keywords.map((keyword) => keyword.toLowerCase());

    return places.filter((place) => {
      const reviews = place.reviews.toLowerCase();
      const description = place.description.toLowerCase();
      const website = place.website.toLowerCase();
      const types = place.types.join(" ").toLowerCase();
      const name = place.name.toLowerCase();
      const vicinity = place.vicinity.toLowerCase();

      const doc = nlp.readDoc(
        [reviews, description, website, types, name, vicinity].join(" ")
      );
      const tokens = doc.tokens().out();

      return keywordsLower.some((keyword) => tokens.includes(keyword));
    });
  };

  return (
    <View style={styles.container} testID={testID}>
      <TouchableOpacity
        style={styles.recommendButton}
        onPress={fetchRecommendations}
      >
        {!loading && <Text style={styles.recommendButtonText}>Recommend</Text>}
        {loading && <ActivityIndicator size="small" color="#0000ff" />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    alignItems: "center",
  },
  recommendations: {
    fontSize: 20,
    marginTop: 10,
    fontFamily: "Inter",
    fontWeight: "400",
    paddingBottom: 10,
    alignSelf: "center",
  },
  recommendButton: {
    backgroundColor: colors.primary400,
    padding: 15,
    margin: 5,
    alignItems: "center",
    borderRadius: 10,
    width: "90%",
    marginTop: "10%",
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  recommendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter",
    fontWeight: "400",
  },
});

export default DiningPlaces;
