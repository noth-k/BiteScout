import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import { useSignUpContext } from '@/providers/SignUpProvider';
import { checkEmailPasswordApi } from '../api/api';

const emailVector = require("@assets/images/email.png");

const signup_name = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const { dispatch } = useSignUpContext();

    const handleNext = async () => {
        
        //check password and email
        const json:any = await checkEmailPasswordApi(email, password);
        const errorMsg = json?.error;
        setError(errorMsg);

        if (json?.isSuccess) {
            //dispatch
            dispatch({
                type: "ADD_EMAIL_AND_PASSWORD",
                payload: {email, password},
            })
            //router to next page
            router.push("./signup_avatar");
        }

        // //dispatch
        // dispatch({
        //     type: "ADD_EMAIL_AND_PASSWORD",
        //     payload: {email, password},
        // })
        // //router to next page
        // router.push("./signup_avatar");
        
    }

    const handleBack = () => {
        dispatch({
            type: "REMOVE_EMAIL_AND_PASSWORD",
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
        <Image source={emailVector} style={styles.title} />
        <InputField
            label={"Email"}
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <View style={styles.container}>
        <Text style={styles.caption}>Password</Text>
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
        </View>
        <Text 
        style={password == "" && email == "" ? styles.next : styles.nextSelected}
        onPress= {password == "" && email == "" ? () => {} : handleNext}
        >{"Next >"}</Text>

        {error != "" && <Text style={styles.label}>{error}</Text>}
        
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
        height: 150,
        width: 330,
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

    label: {
        fontFamily: "Inter",
        fontSize: 15,
        fontWeight: "300",
        marginTop: 20,
        marginBottom: 5,
        color: "red", 
        alignSelf: "center",
      },
      inputContainer: {
        flexDirection: "row",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "gray",
        padding: 12,
        marginHorizontal:15,
        width: "100%",
        backgroundColor: "white",
      },
      showText: {
        color: "blue",
        marginLeft: 10,
        fontFamily: "Inter",
        fontWeight: "300",
      },
      container: {
        marginVertical:20,
        marginHorizontal:15,
    },
    caption: {
        fontFamily: "Inter",
        fontSize: 15,
        fontWeight: "300",
        marginTop: 5,
        marginBottom: 5,
      },
})