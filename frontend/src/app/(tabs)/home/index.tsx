import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import colors from '@assets/colors';
import VibeContainer from '@/components/VibeContainer';

const displayVector = require("@assets/images/displayImage.png");

type Vibe = {
  name: String;
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

const Index = () => {
  const [selectedVibe, setSelectedVibe] = useState<String>('');

  return (
    <View>
      <View style={styles.display}>
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
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  display: {
    width: '100%',
    height: '60%',
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
  }
});
