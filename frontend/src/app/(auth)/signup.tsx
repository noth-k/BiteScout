import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button as RNButton,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import colors from "@assets/colors";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { signUpApi } from "../api/api";
import { User } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // Correct import for Picker

const signup = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [preferences, setPreferences] = useState<string>("");
  const [restrictions, setRestrictions] = useState<string>("Nil");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [error, setError] = useState<string>("noError");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { user, dispatch } = useAuthContext();

  useEffect(() => {
    if (user != null) {
      router.push("/(tabs)/");
    }
  }, [user]);

  const handleSignUp = async () => {
    const user: User = {
      email,
      password,
      name,
      preferences,
      restrictions,
      rooms: [],
    };

    const resetFields = () => {
      setName("");
      setEmail("");
      setPassword("");
      setPreferences("");
      setRestrictions("Nil"); // default nil
      setSecureTextEntry(true);
      setError("noError");
    };

    const json: any = await signUpApi(user);
    const errorMsg = json?.error;
    setError(errorMsg);
    console.log(json);

    if (json?.token) {
      resetFields();
      router.push("/(tabs)/home/");
      console.log(json.user);
      dispatch({ type: "LOGIN", payload: json.user });
      try {
        await AsyncStorage.setItem("user", JSON.stringify(json.user));
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FontAwesome
          name="angle-left"
          style={styles.back}
          onPress={router.back}
        />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            style={styles.inputContainer}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@example.com"
            style={styles.inputContainer}
            keyboardType="email-address"
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
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.inputContainer}
          >
            <Text>{restrictions}</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Select Dietary Restriction
                </Text>
                <Picker
                  selectedValue={restrictions}
                  onValueChange={(itemValue: string) =>
                    setRestrictions(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Halal" value="Halal" />
                  <Picker.Item label="Vegetarian" value="Vegetarian" />
                  <Picker.Item label="Vegan" value="Vegan" />
                  <Picker.Item label="Nil" value="Nil" />
                </Picker>
                <RNButton title="Done" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
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
        </ScrollView>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  picker: {
    width: "100%", // need to add this otherwise picker might not be visible idk also
  },
});
