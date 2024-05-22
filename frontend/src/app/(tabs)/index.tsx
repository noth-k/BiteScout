import { StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Button from '@/components/Button';
import Container from '@/components/Container';

type Vibe = {
  name: String
}

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
  return (
    <SafeAreaView>
      
      <View style={styles.container}>
      <Text style= {styles.title}>Discover Food through Vibes...</Text>
      <FlatList 
        data={vibes}
        renderItem={({ item }) => <Container item={item.name} buttonStyle={{padding: 15}}/>}
        numColumns={2}
        contentContainerStyle={{gap:30, padding:10, marginTop:20, flexDirection:"column"}}
        columnWrapperStyle={{alignSelf:"center", gap:30}}
        />
        <Text style={styles.price}>Price Range</Text>
        <View style={styles.priceContainer}>
          <Container item='$' buttonStyle={{padding:15}}/>
          <Container item="$$" buttonStyle={{padding:15}}/>
          <Container item="$$$"buttonStyle={{padding:15}}/>
        </View>
        <Button text="Recommend" buttonStyle={{marginTop: 70}}/>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:"10%",
  },
  title: {
    fontSize: 35,
    fontFamily:"Inter",
    fontWeight: 'bold',
    marginBottom:20,
  },
  price: {
    fontSize: 20,
    marginTop: 25,
    fontFamily: "Inter",
    fontWeight:"300",
  },
  priceContainer: {
    marginTop:25,
    flexDirection: "row",
    flex: 1,
    justifyContent:"center",
    gap: 10,
  }

  
});
