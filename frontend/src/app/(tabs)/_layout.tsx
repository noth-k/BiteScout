import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import colors from "@assets/colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary400, // Set active tab icon color to blue
        tabBarInactiveTintColor: "lightgrey", // Set inactive tab icon color
        tabBarStyle: { backgroundColor: "white" },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Rooms",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="address-book"
              color={color}
              style={{ fontSize: 20 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="restaurant"
        options={{
          title: "Upvote",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="cutlery"
              color={color}
              style={{ fontSize: 20 }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" color={color} style={{ fontSize: 20 }} />
          ),
        }}
      />
    </Tabs>
  );
}
