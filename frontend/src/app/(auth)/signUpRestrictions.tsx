import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button as RNButton } from 'react-native'
import React, { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import { useSignUpContext } from '@/providers/SignUpProvider';
import { Picker } from '@react-native-picker/picker';
import { signUpApi } from '../api/api';
import { useAuthContext } from '@/providers/AuthProvider';
import { User } from '@/types';

const restrictionsVector = require("@assets/images/restrictions.png");

const SignUpRestrictions = () => {
    const router = useRouter();
    const { user, dispatch: authDispatch} = useAuthContext();
    const [restrictions, setRestrictions] = useState("");
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const { name, email, password, avatar, preferences, dispatch } = useSignUpContext();

    const handleSubmit = async () => {
        
        const user: User = {
            name: name,
            email: email,
            password: password,
            preferences: preferences, 
            restrictions: restrictions,
            avatar: avatar,
            rooms: [],
            upvotedRestaurants: [],
            recommendations:[],

        }

        //Do the sign up procedure
        const json: any = await signUpApi(user);
        console.log(json);

    if (json?.token) {
      router.push("../(tabs)/home/");
      console.log(json.user);
      authDispatch({ type: "LOGIN", payload: json.user });
    }
    }

    const handleBack = () => {
        dispatch({
            type: "REMOVE_RESTRICTIONS",
            payload: '',
        })
        router.back();
    }
  return (
    <SafeAreaView style={{backgroundColor:'white', height:"100%"}}>
        <FontAwesome
              name="angle-left"
              style={styles.back}
              onPress={handleBack}
              testID='back-button'
            />
        <Image source={restrictionsVector} style={styles.title} />

        <View style={{padding: 20, }}>
        <Text style={styles.label}>Dietary Restrictions</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.inputContainer}
            testID='open-diet-restrictions-model'
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
                  testID='diet-picker'
                >
                  <Picker.Item label="Halal" value="Halal" />
                  <Picker.Item label="Vegetarian" value="Vegetarian" />
                  <Picker.Item label="Vegan" value="Vegan" />
                  <Picker.Item label="Nil" value="Nil" />
                </Picker>
                <RNButton title="Done" onPress={() => setModalVisible(false)} testID='done-diet-model'/>
              </View>
            </View>
          </Modal>
        </View>
        
        <Text 
        style={restrictions == "" ? styles.next : styles.nextSelected}
        onPress= {restrictions == "" ? () => {} : handleSubmit}
        >{"Let's Go!"}</Text>
        
    </SafeAreaView>
  )
}

export default SignUpRestrictions;

const styles = StyleSheet.create({
    back: {
        marginLeft: 20,
        fontSize: 30,
    },

    title: {
        height: 180,
        width: 300,
        alignSelf: "center",
        justifyContent:'flex-start',
    },

    nextSelected: {
        fontFamily:"Inter",
        textAlign:"right",
        color:'black',
        marginRight:20
    },

    next: {
        fontFamily:"Inter",
        textAlign:"right",
        color:'lightgrey',
        marginRight:20
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
})