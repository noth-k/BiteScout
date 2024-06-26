import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import colors from '@assets/colors';
import VibeContainer from '@/components/VibeContainer';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateSubmittedUsersApi } from '@/app/api/api';
import { useAuthContext } from '@/providers/AuthProvider';

const displayVector = require("@assets/images/displayImage.png");

type Vibe = {
  name: string;
};

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

const priceRanges = [
  "Less than $10",
  "Less than $20",
  "Less than $50",
  "Any Price"
];

const selection = () => {
    const { roomData } = useLocalSearchParams();
    const { user } = useAuthContext();
    const parsedRoomData = JSON.parse(typeof roomData === 'string' ? roomData : '[]');
    const [selectedVibe, setSelectedVibe] = useState<string>('');
    const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);
    const router = useRouter();

    const handlePriceChange = (value: number) => {
        // Snap to the closest point
        const closestPoint = Math.round(value);
        setPriceRangeIndex(closestPoint);
    };

    const handleSubmit = async () => {
        if (!user?._id) {
            console.error("no ID");
            return;
          }
        await updateSubmittedUsersApi(parsedRoomData?._id, user?._id, selectedVibe, priceRanges[priceRangeIndex])
        router.back();
    }


  return (
    <View>
      <View style={styles.display}>
      <FontAwesome
        name={"angle-left"}
        onPress={() => router.back()}
        style={{color:'white', fontSize:30, marginTop:'auto', marginLeft:20,}}/>

        <Image source={displayVector} style={styles.title}/>
      </View>
      <View style={{ margin: 15 }}>
        <Text style={styles.label}>SELECT VIBE</Text>
        <FlatList
          data={vibes}
          renderItem={({ item }) => (
            <VibeContainer 
              vibe={item.name}
              selected={selectedVibe === item.name}
              onPress={() => setSelectedVibe(item.name)}
            />
          )}
          horizontal={true}
          contentContainerStyle={{
            gap: 5,
          }}
        />
        <Text style={styles.label}>SELECT PRICE RANGE</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={3}
          step={1}
          value={priceRangeIndex}
          onValueChange={handlePriceChange}
          minimumTrackTintColor={colors.primary400}
          maximumTrackTintColor="gray"
          thumbTintColor={colors.primary400}
        />
        <Text style={styles.priceLabel}>{`${priceRanges[priceRangeIndex]}`}</Text>
      </View>

      <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
      {/* <DiningPlaces selectedPrice={priceRanges[priceRangeIndex]} /> */}
    </View>
  );
};

export default selection;

const styles = StyleSheet.create({
  display: {
    width: '100%',
    height: '50%',
    backgroundColor: colors.primary400,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    height: 210,
    width: 350,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: '8%',
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 30,
    marginBottom:10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  priceLabel: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: 'grey',
  },
  submit: {
    width:'80%',
    height:50,
    backgroundColor:colors.primary400,
    alignSelf:'center',
    borderRadius:15,
    justifyContent:'center',
    marginTop:40,
  },
  submitText: {
    color:"white",
    fontFamily:'Inter',
    fontSize:15, 
    textAlign:'center',
  }
});