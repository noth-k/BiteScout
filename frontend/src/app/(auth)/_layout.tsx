import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="SignUpName" options={{ headerShown: false }} />
      <Stack.Screen name="signUpAvatar" options={{ headerShown: false }} />
      <Stack.Screen name="signUpEmail" options={{ headerShown: false }} />
      <Stack.Screen name="signUpPreferences" options={{ headerShown: false }} />
      <Stack.Screen name="signUpRestrictions" options={{ headerShown: false }} />
    </Stack>
  );
}
