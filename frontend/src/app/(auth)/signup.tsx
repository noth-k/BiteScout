import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import colors from "@assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { signUpApi } from "../api/api";
import { User } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const signup = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState("noError");
  const { dispatch } = useAuthContext();

  const handleSignUp = async () => {
    const user: User = {
      email,
      password,
      name,
      preferences,
      restrictions,
    };

    const resetFields = () => {
      setName("");
      setEmail("");
      setPassword("");
      setPreferences("");
      setRestrictions("");
      setSecureTextEntry(true);
      setError("noError");
    };

    const json: any = await signUpApi(user);
    const errorMsg = json?.response?.json?.error;
    setError(errorMsg);
    console.log(json);

    if (json?.token) {
      resetFields();
      //set session data
      router.push("/(tabs)/");
      dispatch({ type: "LOGIN", payload: json.user });
      try {
        await AsyncStorage.setItem("user", JSON.stringify(json));
      } catch (e) {
        console.log("Failed to save user token");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FontAwesome
          name="long-arrow-left"
          style={styles.back}
          onPress={router.back}
        />
        <View style={styles.container}>
          <Text style={styles.title}>Lets get you started</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Jon"
            style={styles.inputContainer}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            placeholder="jon@gmail.com"
            style={styles.inputContainer}
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={{ flex: 1 }}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <Text style={styles.showText}>
                {secureTextEntry ? "Show" : "Hide"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Preferences</Text>
          <TextInput
            value={preferences}
            onChangeText={setPreferences}
            placeholder="Japanese, Thai"
            style={styles.inputContainer}
          />
          <Text style={styles.label}>Dietary Restrictions</Text>
          <TextInput
            value={restrictions}
            onChangeText={setRestrictions}
            placeholder="Halal"
            style={styles.inputContainer}
          />
          <Button
            text="Sign Up"
            buttonStyle={{ marginTop: 40, marginBottom: 80 }}
            onPress={handleSignUp}
          />
          {error != "noError" && (
            <Text
              style={[
                styles.label,
                { color: "red", marginTop: 10, alignSelf: "center" },
              ]}
            >
              {error}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default signup;

const styles = StyleSheet.create({
  back: {
    marginLeft: 20,
    fontSize: 30,
    color: colors.primary800,
  },
  container: {
    padding: "10%",
  },
  title: {
    fontFamily: "Inter",
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary800,
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "300",
    marginTop: 20,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    width: "100%",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  showText: {
    color: "blue",
    marginLeft: 10,
    fontFamily: "Inter",
    fontWeight: "300",
  },
});
