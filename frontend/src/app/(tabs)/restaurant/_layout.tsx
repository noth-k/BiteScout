import { Stack } from "expo-router";
import React from "react";

export default function RestaurantLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="leaderboards"
        options={{ headerShown: false, title: "Leaderboard" }}
      />
    </Stack>
  );
}
