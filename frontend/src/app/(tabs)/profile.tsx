import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuthContext } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const { user, dispatch } = useAuthContext();

  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user);
    }
  }, [user]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      dispatch({ type: "LOGOUT", payload: null });
      router.push("/");
    } catch (e) {
      console.log("Failed to remove user token", e);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text>{user?.name}</Text>
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text>{user?.email}</Text>
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Preferences:</Text>
            <Text>{user?.preferences}</Text>
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Restrictions:</Text>
            <Text>{user?.restrictions}</Text>
          </View>
          <Button text="Log out" onPress={logout} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 10,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
  },
  labelContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "300",
    marginTop: 5,
    marginBottom: 5,
  },
});
