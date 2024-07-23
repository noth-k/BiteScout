import React from "react";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="upvotedRestaurant" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{headerShown: false}}/>
    </Stack>
  );
}
