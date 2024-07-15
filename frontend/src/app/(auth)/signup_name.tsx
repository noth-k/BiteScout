import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import { useSignUpContext } from '@/providers/SignUpProvider';

const nameVector = require("@assets/images/name.jpg");

const signup_name = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const { dispatch } = useSignUpContext();

    const handleNext = () => {
        //dispatch
        dispatch({
            type: "ADD_NAME",
            payload: name,
        })
        //router to next page
        router.push("./signup_email");
    }

    const handleBack = () => {
        dispatch({
            type: "REMOVE_NAME",
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
            />
        <Image source={nameVector} style={styles.title} />
        <InputField
            label={"Name"}
            value={name}
            onChangeText={(text) => setName(text)}
        />
        <Text 
        style={name == "" ? styles.next : styles.nextSelected}
        onPress= {name == "" ? () => {} : handleNext}
        >{"Next >"}</Text>
        
    </SafeAreaView>
  )
}

export default signup_name;

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
    }
})