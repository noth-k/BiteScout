import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/providers/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BubbleTextComponent from "@/components/BubbleTextComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "@/components/Button";
import colors from "@assets/colors";

const profileBackground = require("@assets/images/profileBackground.jpg");

const avatarImages: { [key: string]: any } = {
  man_1: require("@assets/images/man_1.png"),
  man_2: require("@assets/images/man_2.png"),
  man_3: require("@assets/images/man_3.png"),
  man_4: require("@assets/images/man_4.png"),
  man_5: require("@assets/images/man_5.png"),
  man_6: require("@assets/images/man_6.png"),
  man_7: require("@assets/images/man_7.png"),
  man_8: require("@assets/images/man_8.png"),
  woman_1: require("@assets/images/woman_1.png"),
  woman_2: require("@assets/images/woman_2.png"),
  woman_3: require("@assets/images/woman_3.png"),
  woman_4: require("@assets/images/woman_4.png"),
  woman_5: require("@assets/images/woman_5.png"),
  woman_6: require("@assets/images/woman_6.png"),
  woman_7: require("@assets/images/woman_7.png"),
  woman_8: require("@assets/images/woman_8.png"),
};

const index = () => {
  const { user, dispatch } = useAuthContext();
  const router = useRouter();
  const preferences = user?.preferences;
  const restrictions = user?.restrictions || "undefined";
  const restrictionsArr = restrictions.split(",");

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log("Failed to remove user token");
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <ImageBackground
          source={profileBackground}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.overlay} />
          <TouchableOpacity
            style={styles.editComponent}
            onPress={() => router.push("/profile/editProfile/")}
          >
            <FontAwesome name="pencil" style={styles.editPencil} />
            <Text style={styles.edit}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.nameContainer}>
            <Image
              style={styles.profilePicture}
              source={avatarImages[user?.avatar || "man_1"]}
              resizeMode="contain"
            />
            <View style={styles.nameDetails}>
              <View style={{ padding: 7, marginLeft: 10 }}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.details}>{user?.name}</Text>
              </View>
              <View style={{ padding: 7, marginLeft: 10 }}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.details}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* main */}
      <ScrollView style={styles.main}>
        <BubbleTextComponent items={preferences || []} title={"Preferences"} />
        <BubbleTextComponent
          items={restrictionsArr || []}
          title={"Restrictions"}
        />

        <TouchableOpacity >
        <Text style={{ margin: "5%", textAlign: "center", fontFamily:"Inter" }} onPress={() => {
          router.push("/profile/history");
        }}> History </Text>
        </TouchableOpacity>
        

        <Text
          onPress={() => {
            dispatch({ type: "LOGOUT", payload: null });
            router.push("/");
            logout();
          }}
          style={{ margin: "5%", textAlign: "center", color: "red", fontFamily:"Inter"}}
        >
          Log out
        </Text>
      </ScrollView>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    height: "40%",
  },
  editComponent: {
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  edit: {
    fontFamily: "Inter",
    fontSize: 15,
    color: "white",
    marginTop: 16,
    marginRight: 17,
    fontWeight: "600",
  },
  editPencil: {
    fontSize: 20,
    marginRight: 10,
    marginTop: 15,
    color: "white",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    justifyContent: "center",
    opacity: 0.3,
  },
  nameContainer: {
    flexDirection: "row",
    marginLeft: "10%",
    marginRight: "10%",
    marginTop: "15%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 6,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  profilePicture: {
    height: 100,
    width: 100,
  },
  nameDetails: {
    flex: 2,
  },
  details: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "300",
  },
  label: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "500",
  },
  main: {
    flex: 2,
  },
  past: {
    padding: 20,
    margin: "5%",
    borderWidth: 1,
    borderColor: "grey",
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  upvotedRestaurantsButton: {
    margin: 10,
    padding: 10,
    backgroundColor: colors.primary400,
    borderRadius: 5,
    alignItems: "center",
  },
  upvotedRestaurantsText: {
    color: "#fff",
    fontSize: 16,
  },
});
