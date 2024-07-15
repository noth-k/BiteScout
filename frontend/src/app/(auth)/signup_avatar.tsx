import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/components/InputField';
import { useSignUpContext } from '@/providers/SignUpProvider';
import AvatarListItem from '@/components/AvatarListItem';

const avatarVector = require("@assets/images/avatar.png");

const signup_name = () => {
    const router = useRouter();
    const [avatar, setAvatar] = useState("");
    const { dispatch } = useSignUpContext();

    const handleNext = () => {
        //dispatch
        dispatch({
            type: "ADD_AVATAR",
            payload: avatar,
        })
        //router to next page
        router.push("./signup_preferences");
    }

    const handleBack = () => {
        dispatch({
            type: "REMOVE_AVATAR",
            payload: '',
        })
        router.back();
    }

    const avatars:string[] = ["man_1", "man_2", "man_3", "man_4", "man_5", "man_6", "man_7", "man_8", "woman_1", "woman_2", "woman_3", "woman_4", "woman_5", "woman_6", "woman_7", "woman_8"];
  return (
    <SafeAreaView style={{backgroundColor:'white', height:"100%"}}>
        <FontAwesome
              name="angle-left"
              style={styles.back}
              onPress={handleBack}
            />
        <Image source={avatarVector} style={styles.title} />
        
        <FlatList 
        data={avatars} 
        renderItem={({item}) => (
            <TouchableOpacity onPress={() => setAvatar(item)}>
            <AvatarListItem avatar={item} selected={avatar == item} />
            </TouchableOpacity>
        )}
        numColumns={2}
        contentContainerStyle={{
            gap: 20,
        }}
        
        
        columnWrapperStyle={{gap:20, alignSelf:"center" }}
        
        />
        <Text 
        style={avatar == "" ? styles.next : styles.nextSelected}
        onPress= {avatar == "" ? () => {} : handleNext}
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
        width: 370,
        alignSelf: "center",
        justifyContent:'flex-start',
        marginBottom: 10, 
    },

    nextSelected: {
        fontFamily:"Inter",
        textAlign:"right",
        color:'black',
        marginRight:20,
        padding: 20,
    },

    next: {
        fontFamily:"Inter",
        textAlign:"right",
        color:'lightgrey',
        marginRight:20,
        padding: 20, 
    }
})