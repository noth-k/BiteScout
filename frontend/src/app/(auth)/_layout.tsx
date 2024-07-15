import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup_name" options={{ headerShown: false }} />
      <Stack.Screen name="signup_avatar" options={{ headerShown: false }} />
      <Stack.Screen name="signup_email" options={{ headerShown: false }} />
      <Stack.Screen name="signup_preferences" options={{ headerShown: false }} />
      <Stack.Screen name="signup_restrictions" options={{ headerShown: false }} />
    </Stack>
  );
}
