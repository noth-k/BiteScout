import React from "react";
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <Stack.Screen name='recommendations' options={{headerShown:false}}/>
        <Stack.Screen name='recommend' options={{headerShown:false}}/>
        <Stack.Screen name="grprecommendations" options={{headerShown: false}} />
    </Stack>
  )
}

