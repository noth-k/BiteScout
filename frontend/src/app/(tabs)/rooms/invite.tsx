import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchRoomApi, fetchUserDataApi, updateRoomApi, updateRoomsApi } from '@/app/api/api';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Room } from '@/types';
import colors from '@assets/colors';
import { useAuthContext } from '@/providers/AuthProvider';

const inviteVector = require("@assets/images/letter.png");


const invite = () => {
    const {roomId } = useLocalSearchParams();
    const router = useRouter();
    const { user:authUser, dispatch } = useAuthContext();
    const [roomData, setRoomData] = useState<Room | null>(null);

    useEffect(() => {
        if (!authUser) {
          router.push("/");
        }
        if (authUser?.rooms.includes(roomId as string)) {
            router.push("/");
        }
      }, [authUser]);

    const handleAddUser = async() => {
        const newUser: string[] = [authUser?._id || ""];
        const newRestriction: string[] = [authUser?.restrictions || ""]
        //update the room to include new users
        const json:any = await updateRoomApi(roomId as string, newUser, newRestriction);
        console.log("updated room", json);

        
        const user = await updateRoomsApi(authUser?._id || "", roomId as string);
        console.log("updated user: ", user);

        const updatedUser:any = await fetchUserDataApi(authUser?._id);
        console.log("user", updatedUser.user);
        dispatch({ type: "LOGIN", payload: updatedUser.user });
        router.push('./');
    };

    const handleDecline = () => {
        router.push('./');
    }

    const fetchData = async () => {
        try {
          const roomResponse: any = await fetchRoomApi(roomId);
          setRoomData(roomResponse.room);
    
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

    useEffect(() => {
        fetchData();
    }, [])

  return (
    <View style={styles.background}>
        <Image source={inviteVector} style={styles.vector} />
        <View>
            <Text style={styles.header}>You have been invited to join: </Text>
            <Text style={styles.title}>{roomData?.name}</Text>
            <View style={styles.selection}>
                <TouchableOpacity style={styles.button} onPress={handleAddUser}>
                    <Text style={styles.buttonLabel}>Join</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleDecline}>
                    <Text style={styles.buttonLabel}>Decline</Text>
                </TouchableOpacity>
                
            </View>
        </View>  
    </View>
  )
}

export default invite;

const styles = StyleSheet.create({
    background: {
        backgroundColor: "white",
        height:'100%',
        flex:1,
        justifyContent:'center',
    },
    header: {
        color:"black",
        fontFamily:'Inter',
        fontWeight:"bold",
        fontSize: 25,
        textAlign:'center',
        marginHorizontal:55,

    },
    title: {
        color:colors.primary400,
        fontFamily:"Inter",
        fontWeight:300,
        fontSize:30, 
        textAlign:'center',
        marginTop: 30,
    }, 
    selection: {
        flexDirection:'row',
        alignSelf:'center',
        marginTop:30, 
    },
    button: {
        padding:10,
        margin:10, 
        height:40,
        width: "20%",
        backgroundColor:'white',
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: -2,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    buttonLabel: {
        textAlign:'center',
        color: "black",
        fontSize:15, 
    },
    vector: {
        height: 150,
        width: 150,
        alignSelf: "center",
        marginBottom:30, 
    },
})