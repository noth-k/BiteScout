import { View, Text, StyleSheet, Alert, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchRoomApi } from '@/app/api/api';
import { Room } from '@/types';
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import MemberAddIconComponent from '@/components/MemberAddIconComponent';
import CircularProgress from '@/components/CircularProgress';
import { useAuthContext } from '@/providers/AuthProvider';

const RoomScreen = () => {
    const { id } = useLocalSearchParams();
    const { user } = useAuthContext();
    const router = useRouter();
    const [roomData, setRoomData] = useState<Room | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const currSubmittedUsers = roomData?.submittedUsers || [];
    const waitingList = roomData?.users.filter(user => !currSubmittedUsers.includes(user || ""));
    
    

    const handleAddFriends = () => {
        //current users in an array
        const filteredUsers = (roomData?.users || []).filter(
          (user): user is string => user !== undefined && user !== null
        );

        console.log(filteredUsers);
        console.log(roomData?._id);
        router.push({
          pathname: '/rooms/addFriends/',
          params: {
            previousScreen: 'Room',
            currUsers: JSON.stringify(filteredUsers),
            roomId: roomData?._id,
          },
        });
      };

    const handleSubmit = () => {
        setSubmitted(true);
        currSubmittedUsers.push(user?._id || "");
    }
    
    //fetching room details
    useEffect(() => {
        const getRoom = async () => {
            const json: any = await fetchRoomApi(id);
            setRoomData(json.room);
        }
        getRoom();
        

    }, [])

   

  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
        {/* header */}
        <View style={styles.header}>
            <View style={styles.title}>
                <FontAwesome
                    name="long-arrow-left"
                    style={styles.back}
                    onPress={() => router.back()}
                />
                <Text style={styles.roomName}>{roomData?.name}</Text>
                <FontAwesome 
                    name= "ellipsis-h"
                    style={styles.menu}
                    />
            </View>
            <MemberAddIconComponent onPress={handleAddFriends} iconStyle={styles.icons}/>
        <View style={styles.roomDetails}>
            <CircularProgress userCount={roomData?.users.length || 0} submitCount={roomData?.submittedUsers.length || 0} style={{marginLeft:30}}/>
            <View>
                <Text style={styles.waitLabel} onPress={() => {router.push({pathname: '/rooms/waitlist', params: { waitingList: JSON.stringify(waitingList) }})}}>Waiting on...</Text>
                <TouchableOpacity style={styles.submit} disabled={submitted} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Select Vibe</Text>
                </TouchableOpacity>
            </View>
        </View>
        
            <View>

            </View>
        </View>
      <Text>RoomScreen {id} </Text>
      
    </View>
  )
}

export default RoomScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor:colors.primary400,
        height:'55%',
        borderRadius:15,
        shadowColor:'black',
        shadowOffset:{
        width:-2,
        height:2,
        },
        shadowOpacity:0.5,
        shadowRadius:3,
    },
    title: {
        height: '25%',
        flexDirection:'row'
    },
    back: {
        fontSize:24,
        color:'white',
        marginTop:'auto',
        padding:20,
    },
    menu: {
        fontSize:20,
        color:'white',
        marginTop:'auto',
        padding:20,
        marginLeft:'auto',
    },
    roomName: {
        marginTop:'auto',
        fontFamily: 'Inter',
        color:'white',
        fontSize: 20,
        padding:20,
        marginLeft:'18%'
    },
    icons: {
        fontSize:18,
        color:'white',
    },
    roomDetails: {
        flexDirection:'row',
        marginTop:30,

    },
    waitLabel: {
        color:'white',
        fontFamily:'Inter',
        fontSize:18,
        fontWeight: "bold",
        marginLeft:"25%",
        marginTop:"10%",
    },
    submit: {
        backgroundColor:'white',
        padding:10, 
        width:'60%',
        alignSelf:'center',
        borderRadius:10,
        shadowColor:'black',
        shadowOffset:{
        width:-2,
        height:2,
        },
        shadowOpacity:0.5,
        shadowRadius:3,
        marginTop:40,
    },
    submitText: {
        color: colors.primary400,
        fontSize:15, 
        fontWeight:'bold',
        textAlign:'center',
    }
})