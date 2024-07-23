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

const avatarImages: { [key: string]: any } = {
  man_1: require('@assets/images/man_1.png'),
  man_2: require('@assets/images/man_2.png'),
  man_3: require('@assets/images/man_3.png'),
  man_4: require('@assets/images/man_4.png'),
  man_5: require('@assets/images/man_5.png'),
  man_6: require('@assets/images/man_6.png'),
  man_7: require('@assets/images/man_7.png'),
  man_8: require('@assets/images/man_8.png'),
  woman_1: require('@assets/images/woman_1.png'),
  woman_2: require('@assets/images/woman_2.png'),
  woman_3: require('@assets/images/woman_3.png'),
  woman_4: require('@assets/images/woman_4.png'),
  woman_5: require('@assets/images/woman_5.png'),
  woman_6: require('@assets/images/woman_6.png'),
  woman_7: require('@assets/images/woman_7.png'),
  woman_8: require('@assets/images/woman_8.png'),
};


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
    const avatarSource = avatarImages[user?.avatar || 'man_1'];
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
        <Image source={avatarSource} style={styles.avatar} resizeMode="contain"/>
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
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 40,
    position: "absolute",
    top: 170,
    right: 215,
  },
});