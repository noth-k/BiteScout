import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import colors from '@assets/colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import InputField from '@/components/InputField';
import MemberListItem from '@/components/MemberListItem';
import MemberAddIconComponent from '@/components/MemberAddIconComponent';
import { useAuthContext } from '@/providers/AuthProvider';
import { Room } from '@/types';
import { useSelectedUsersContext } from '@/providers/SelectedUsersProvider';
import { createRoomApi, updateRoomsApi, fetchUserDataApi } from "../../api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

const createVector = require("@assets/images/createRoom.png");

const createRoom = () => {
    const router = useRouter();
    const [roomName, setRoomName] = useState('');
    const { user, dispatch: authDispatch } = useAuthContext();
    const { selectedUsersState, dispatch } = useSelectedUsersContext();
    
    const usersId = selectedUsersState.map(user => user._id);
    usersId.push(user?._id);
    const usersRestrictions = selectedUsersState.map(user => user.restrictions);
    usersRestrictions.push(user?.restrictions || "undefined");

    const handleSubmit = async () => {
        console.log("members: ", usersId);
        console.log("room Name: ", roomName);
        const room: Room = {
            name: roomName,
            users: usersId,
            restrictions:usersRestrictions,
            submittedUsers:[],
            pastRecommendation:[],
        }
        //create room instance with members userIds inside with the name
        const json: any = await createRoomApi(room);
        // console.log(json.room);
        const roomId = json.room._id;
        const users = json.room.users;

        //put roomId into the users rooms data
        {for (const userId of users ) {
            const json:any = await updateRoomsApi(userId, roomId);
            // console.log(json);
        }}

        //update auth context
        const updatedUser:any = await fetchUserDataApi(user?._id);
        console.log("user", updatedUser.user);
        authDispatch({ type: "LOGIN", payload: updatedUser.user });

        try {
            await AsyncStorage.setItem("user", JSON.stringify(updatedUser.user));
        } catch (e) {
            console.log("Failed to save user token");
        } 
        
        resetFields();
        router.push('/(tabs)/rooms/');
    }

    const handleBack = () => {
        dispatch({ type: "CLEAR_USERS", payload: null });
        router.back();
    }

    const resetFields = () => {
        setRoomName('');
        dispatch({ type: "CLEAR_USERS", payload: null });
        
    }
    
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
            name="long-arrow-left"
            style={styles.back}
            onPress={handleBack}
        />
        <Text style={styles.title}>Create Room</Text>
      </View>
      <ScrollView>
        <Image source={createVector} style={styles.vector}/>
        <InputField label={'Room Name:'} value={roomName} onChangeText={(text) => setRoomName(text)}/>
        <View style={styles.membersTitle}>
            <Text style={styles.membersLabel}>Members</Text>
            <MemberAddIconComponent onPress={() => router.push({
              pathname: '/rooms/addFriends/',
              params: {previousScreen: "Create", currUsers: [], roomId:''}
            })} iconStyle={styles.icons}/>
        </View>
        
        {selectedUsersState.map(user => (
            <MemberListItem key={user._id} user={user}/>
        ))}
        {selectedUsersState.length == 0 && <View style={{width: '100%', height: '10%'}}></View>}
        <TouchableOpacity style={{padding:10, backgroundColor:colors.primary400, width: '30%', alignSelf:'center', borderRadius:10, marginVertical:10}} onPress={handleSubmit} >
            <Text style={{fontFamily:'Inter', fontSize: 15, color:'white', textAlign:'center'}}>Create</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  )
}

export default createRoom;

const styles = StyleSheet.create({
    container: {
        backgroundColor:'white',
        height:'100%',
        width:'100%',
    },
    header: {
        width: '100%',
        height: '13%',
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:colors.primary400,
        shadowColor:'black',
        shadowOffset:{
        width:-2,
        height:2,
        },
        shadowOpacity:0.5,
        shadowRadius:3,
    },
    back: {
        fontSize:24,
        color:'white',
        marginTop:'auto',
        padding:20,
    },
    title: {
        color:'white',
        fontFamily:'Inter',
        fontSize:20,
        fontWeight:'bold',
        marginTop:'auto',
        marginBottom: 20,
        marginLeft:'18%',
    },
    vector: {
        height:240,
        width:260,
        marginVertical:30,
        alignSelf:'center',
    },
    membersTitle: {
        flexDirection:'row',
    },
    membersLabel: {
        flex:1,
        marginRight:'auto',
        marginLeft: 15,
        fontFamily: 'Inter',
        fontWeight: '300',
        fontSize:14,
        marginVertical:10,
    },
    membersAdd: {
        flexDirection:'row',
        marginLeft:'auto',
        marginRight:20,
        marginVertical:5,
    },
    icons: {
        fontSize:15,
        color:'lightgrey',
    }

})