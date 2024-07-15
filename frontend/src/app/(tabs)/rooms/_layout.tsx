import React from "react";
import { Stack } from 'expo-router';
import { ScreenStackHeaderSearchBarView } from "react-native-screens";

export default function RoomLayout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='create' options={{headerShown:false}}/>
        <Stack.Screen name='addFriends' options={{presentation: 'modal', headerTitle:'Find Friends', headerStyle: {backgroundColor:'white'}}} />
        <Stack.Screen name='waitlist' options={{presentation: 'modal', headerTitle:'Waiting on...', headerStyle:{backgroundColor:'white'}}} />
        <Stack.Screen name='[id]' options={{headerShown:false}} />
        <Stack.Screen name='settings' options={{headerShown: false}} />
        <Stack.Screen name='selection' options={{headerShown: false}} />
        <Stack.Screen name="invite" options={{headerShown:false}}/>
    </Stack>
  )
}
