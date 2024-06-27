import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Button as RNButton } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { useAuthContext } from "@/providers/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { User } from "@/types";
import { updateApi } from "@/app/api/api";
import { Picker } from "@react-native-picker/picker";

const profile = () => {
  const router = useRouter();
  const { user, dispatch } = useAuthContext();
  const [ name, setName ] = useState(user?.name || '');
  const [ preferences, setPreferences ] = useState(user?.preferences || '');
  const [ restrictions, setRestrictions ] = useState(user?.restrictions || '')
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [error, setError] = useState('');
  
  const newUser:User = {
    email:user?.email || 'error ',
    name: name,
    password:user?.password || 'error',
    preferences: preferences,
    restrictions: restrictions,
    _id:user?._id || 'error',
    rooms:user?.rooms || [],
  }


  const handleSubmit = async () => {
    //update auth context
    dispatch({ type: "LOGIN", payload: newUser });
    //call updateApi
    const json:any = await updateApi(newUser);
    const errMsg = json?.error;
    setError(errMsg);
    console.log(json);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
    } catch (e) {
      console.log("Failed to save user token");
    }
    router.push('/profile/');
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{backgroundColor:'white'}}>
      <View style={styles.container}>
      <FontAwesome
        name="angle-left"
        style={styles.back}
        onPress={() => router.back()}
      />
      <Text style={styles.title}>Profile</Text>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput 
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder={user?.name}
            style={styles.inputContainer}
            />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput 
            value={user?.email}
            editable={false}
            selectTextOnFocus={false}
            placeholder={user?.email}
            style={[styles.inputContainer, {backgroundColor:'grey'}]}
            />
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Preferences:</Text>
          <TextInput 
            value={preferences}
            onChangeText={(text) => setPreferences(text)}
            placeholder={user?.preferences}
            style={styles.inputContainer}
            />
        </View>

        <Text style={[styles.label, {marginBottom:0, marginTop:10}]}>Dietary Restrictions</Text>
        <View style={styles.labelContainer}>
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
          </View>

        <Button onPress={handleSubmit} text='Update'/>
    

    </View>
    </SafeAreaView>
    </SafeAreaProvider>
    
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    padding:15,
    marginTop: 10,
    height:'100%',
    backgroundColor:'white',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom:15,
  },
  back: {
    fontSize: 24,
    padding: 10,
  },
  labelContainer: {
    marginTop:10,
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '300',
    marginTop: 5,
    marginBottom: 5,
  },
  detailContainer: {
    
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
})
