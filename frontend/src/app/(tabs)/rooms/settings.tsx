import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import colors from '@assets/colors';

const settings = () => {
   const { roomId, roomUsers } = useLocalSearchParams();
   const parsedRoomUsers = typeof roomUsers === 'string' ? JSON.parse(roomUsers) : [];
  
  
  console.log('Room ID:', roomId);
  console.log('Room Users:', parsedRoomUsers);



  return (
    <View>
        <View style={styles.header}>
            <Text>Settings</Text>
        </View>
    </View>
  )
}

export default settings;

const styles = StyleSheet.create({
    header: {
        backgroundColor:colors.primary400,
        flexDirection:'row',
        width: '100%',
        height:'45%',
        shadowColor:'black',
        shadowOffset:{
        width:-2,
        height:2,
        },
        shadowOpacity:0.5,
        shadowRadius:3,
    }
})