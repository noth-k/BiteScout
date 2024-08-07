import {
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState } from "react";
import colors from "@assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import RoomListItem from "@components/RoomListItem";
import { useAuthContext } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { fetchRoomNames, fetchUserDataApi } from "../../api/api";
import { Room, User } from "@/types";
import EmptyRooms from "@/components/EmptyRooms";

export default function TabTwoScreen() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<User>();
  const roomIds = userData?.rooms || ["test"];
  const [names, setNames] = useState<Room[]>([]);
  const displayedNames = names.filter((item) =>
    roomIds.includes(item._id || "error")
  );

  //use Effect hook to make sure all the rooms are displayed are same to the ones in the context
  useEffect(() => {
    const getRoomNames = async () => {
      const json: any = await fetchRoomNames();
      const roomData: Room[] = json.rooms;
      setNames(roomData);
      console.log(roomData)
    };
    getRoomNames();
  }, [roomIds]);

  useEffect(() => {
    const getUserData = async () => {
      if (user && user._id) {
        const fetchedUserData:any = await fetchUserDataApi(user._id);
        setUserData(fetchedUserData.user);
      }
    };

    getUserData();
  }, [user]);

  //filter using the ids that are in roomsId
  // displayedNames = names.filter((item) =>
  //   roomIds.includes(item._id || "error")
  // );
  // // console.log(displayedNames);

  // }, [roomIds]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rooms</Text>
        <TouchableOpacity
          style={styles.create}
          onPress={() => router.push("/rooms/create/")}
        >
          <FontAwesome name="plus" style={{ fontSize: 18, color: "white" }} testID="add-room-test"/>
        </TouchableOpacity>
      </View>

      {names.length > 0 && (
        <ScrollView>
          {displayedNames.map((item) => {
            return (
              <RoomListItem key={item._id} label={item.name} id={item._id} />
            );
          })}
          {displayedNames.length == 0 && <EmptyRooms />}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  header: {
    backgroundColor: colors.primary400,
    flexDirection: "row",
    width: "100%",
    height: "13%",
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: 20,
    marginLeft: "10%",
    color: "white",
    flex: 8,
  },
  create: {
    flex: 1,
    marginTop: "auto",
    marginBottom: 25,
  },
});
