import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  fetchAllUsersApi,
  fetchRoomApi,
  resetSubmittedUsersApi,
} from "@/app/api/api";
import { Room, User } from "@/types";
import colors from "@assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import CircularProgress from "@/components/CircularProgress";
import { useAuthContext } from "@/providers/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";
import GroupReco from "@/components/GroupReco";
import Colors from "@/constants/Colors";


const RoomScreen = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuthContext();
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const currUsers = users?.filter((user: User) =>
    roomData?.users.includes(user._id)
  );
  const waitingUsers = currUsers?.filter(
    (user: User) => !roomData?.submittedUsers.includes(user._id || "")
  );

  const handleSubmit = () => {
    router.push({
      pathname: "./selection",
      params: {
        roomData: JSON.stringify(roomData),
      },
    });
  };

  const handleWaitlist = () => {
    router.push({
      pathname: "/rooms/waitlist",
      params: { waitingList: JSON.stringify(waitingUsers) },
    });
  };

  const handleSettings = () => {
    router.push({
      pathname: "./settings",
      params: {
        roomData: JSON.stringify(roomData),
        currUsers: JSON.stringify(currUsers),
      },
    });
  };

  const handleReset = async () => {
    await resetSubmittedUsersApi(roomData?._id || "");
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const roomResponse: any = await fetchRoomApi(id);
      setRoomData(roomResponse.room);

      const usersResponse: any = await fetchAllUsersApi();
      setUsers(usersResponse);

      if (roomResponse.room?.submittedUsers.includes(user?._id || "")) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id])
  );

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <View style={styles.header}>
        {loading ? (
          <ActivityIndicator size="small" color="white" style={{marginTop: "50%"}}/>
        ) : (
          <>
            <View style={styles.title}>
              <FontAwesome
                name="angle-left"
                style={styles.back}
                onPress={() => router.back()}
              />
              <Text style={styles.roomName}>{roomData?.name}</Text>
              <FontAwesome
                name="cog"
                style={styles.settings}
                onPress={handleSettings}
              />
            </View>
            <View style={styles.roomDetails}>
              <CircularProgress
                userCount={roomData?.users.length || 0}
                submitCount={roomData?.submittedUsers.length || 0}
                style={{ marginLeft: 30 }}
              />
              <View style={{ backgroundColor: colors.primary400 }}>
                {roomData?.submittedUsers.length !== roomData?.users.length && (
                  <Text style={styles.waitLabel} onPress={handleWaitlist}>
                    Waiting on...
                  </Text>
                )}

                {roomData?.submittedUsers.length === roomData?.users.length && (
                  <Text style={styles.waitLabel} onPress={handleReset}>
                    Reset Room
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.submit}
                  disabled={roomData?.submittedUsers.includes(user?._id || "")}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>Input Filters</Text>
                </TouchableOpacity>
              </View>
            </View>
            {roomData &&
              roomData.submittedUsers.length === roomData.users.length && (
                <GroupReco roomId={roomData._id!} /> // Use GroupReco component here with non-null assertion
              )}
          </>
        )}
      </View>
      <Text
        style={{
          fontFamily: "Inter",
          margin: 20,
          fontWeight: "bold",
          color: "lightgrey",
          textAlign: "center",
        }}
      >
        Past Recommendations feature not included yet
      </Text>
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary400,
    height: "55%",
    borderRadius: 15,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    padding: 10,
  },
  title: {
    height: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: colors.primary400,
  },
  back: {
    fontSize: 24,
    color: "white",
  },
  settings: {
    fontSize: 25,
    color: "white",
  },
  roomName: {
    fontFamily: "Inter",
    color: "white",
    fontSize: 20,
    flex: 1,
    textAlign: "center",
  },
  roomDetails: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.primary400,
    marginRight: 20,
  },
  waitLabel: {
    color: "white",
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  resetLabel: {
    color: "white",
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  submit: {
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 40,
  },
  submitText: {
    color: colors.primary400,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  recommend: {
    backgroundColor: "white",
    padding: 10,
    width: "75%",
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    marginTop: 20,
  },
});
