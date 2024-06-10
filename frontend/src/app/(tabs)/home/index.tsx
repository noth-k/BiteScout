import { StyleSheet, FlatList, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import Container from "@/components/Container";
import DiningPlaces from "@/components/DiningPlaces";
import colors from "@assets/colors";
import { useRouter } from "expo-router";


type Vibe = {
  name: String;
};

export default function Home() {
  const vibes: Vibe[] = [
    { name: "Cozy" },
    { name: "Modern" },
    { name: "Casual" },
    { name: "Elegant" },
    { name: "Lively" },
    { name: "Scenic" },
    { name: "Authentic" },
    { name: "Convenient" },
  ];

  const [vibe, setVibe] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.title}>Discover Food through Vibes...</Text>
          <View>
          <FlatList
            data={vibes}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setVibe(`${item.name}`)} style={styles.vibeContainer}>
                <Text style={{color: 'white'}}>
                  {item.name}
                </Text>
                {/* <Container item={item.name} buttonStyle={{ height: 40, width: 120 }} /> */}
              </TouchableOpacity>
            )}
            numColumns={2}
            contentContainerStyle={{
              gap: 30,
              padding: 10,
              marginTop: 20,
              flexDirection: "column",
            }}
            columnWrapperStyle={{ alignSelf: "center", gap: 30 }}
          />
          </View>
          <Text style={styles.price}>Price Range</Text>
          <View style={styles.priceContainer}>
            <TouchableOpacity style={{ flex:1, marginHorizontal: 5, height: 38}} onPress={() => setPrice('$')}>
            <Container item="$" />
            </TouchableOpacity>

            <TouchableOpacity style={{ flex:1, marginHorizontal: 5 }} onPress={() => setPrice('$$')}>
            <Container item="$$"/>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex:1, marginHorizontal: 5 }} onPress={() => setPrice('$$$')}>
            <Container item="$$$" />
            </TouchableOpacity>
            
          </View>

          {/* <Button text="Recommend" buttonStyle={{ marginTop: 70 }} /> */}
          <DiningPlaces></DiningPlaces>
          <Text>Filtering feature not ready yet</Text>
          {(vibe != '') && <Text style={{ color: 'red', fontSize: 15 }}> Selected: {vibe}</Text>}
          {(price != '') && <Text style={{ color: 'red', fontSize: 15 }}> Selected: {price}</Text>}
          <Pressable onPress={() => router.push('/home/recommend/')}>
            <Text>Recommend</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:"10%",
  },
  title: {
    fontSize: 35,
    fontFamily: "Inter",
    fontWeight: "bold",
    marginBottom: 5,
  },
  vibeContainer: {
    backgroundColor: colors.primary800,
    padding:12,
    width:120,
    alignItems:"center",
    justifyContent:'center',
    borderRadius:5,
  },
  price: {
    fontSize: 18,
    marginTop: 25,
    fontFamily: "Inter",
    fontWeight: "300",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch', // Make sure items stretch vertically
    marginBottom:20
  },
});
