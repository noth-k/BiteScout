import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import colors from "@assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { LoginUser } from "@/types";
import { loginApi } from "../api/api";
import { useAuthContext } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
// import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

const loginVector = require("@assets/images/LoginVector.png");

const login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState("noError");
  const { dispatch } = useAuthContext();

  const handleLogin = async () => {
    const loginUser: LoginUser = {
      email,
      password,
    };
    const resetFields = () => {
      setEmail("");
      setPassword("");
    };

    const json: any = await loginApi(loginUser);
    const errorMsg = json?.response?.json?.error;
    console.log(json);
    setError(errorMsg);
    if (json?.token) {
      router.push("/(tabs)/");
      resetFields();
      //set session data
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
          <Image source={loginVector} style={styles.vector} />
          <Text style={styles.title}>Login</Text>
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

          <Text style={styles.changePassword}>Forget your password?</Text>
          <Button text="Log In" onPress={handleLogin} />
          {error != "noError" && (
            <Text style={[styles.label, { color: "red", alignSelf: "center" }]}>
              {error}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default login;

const styles = StyleSheet.create({
  back: {
    marginLeft: 20,
    fontSize: 30,
  },
  container: {
    alignSelf: "center",
    width: "80%",
  },
  vector: {
    height: 340,
    width: 220,
    alignSelf: "center",
  },
  title: {
    fontFamily: "Inter",
    fontSize: 40,
    fontWeight: "bold",
    color: colors.primary800,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "300",
    marginTop: 20,
    marginBottom: 5,
  },
  changePassword: {
    textAlign: "right",
    fontFamily: "Inter",
    fontWeight: "300",
    color: colors.primary800,
    marginBottom: 15,
    marginTop: 5,
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
  showText: {
    color: colors.primary800,
    marginLeft: 10,
    fontFamily: "Inter",
    fontWeight: "300",
  },
});
