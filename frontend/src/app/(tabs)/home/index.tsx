import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "@assets/colors";
import VibeContainer from "@/components/VibeContainer";
import DiningPlaces from "@/components/DiningPlaces";

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
  "Any Price",
];

const Index = () => {
  const [selectedVibe, setSelectedVibe] = useState<string>("");
  const [priceRangeIndex, setPriceRangeIndex] = useState<number>(0);

  const handlePriceChange = (value: number) => {
    // Snap to the closest point
    const closestPoint = Math.round(value);
    setPriceRangeIndex(closestPoint);
  };

  return (
    <View>
      <View style={styles.display}>
        <Image source={displayVector} style={styles.title} />
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
        <Text
          style={styles.priceLabel}
        >{`${priceRanges[priceRangeIndex]}`}</Text>
      </View>
      <DiningPlaces
        selectedPrice={priceRanges[priceRangeIndex]}
        selectedVibe={selectedVibe}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  display: {
    width: "100%",
    height: "50%",
    backgroundColor: colors.primary400,
    borderRadius: 10,
    shadowColor: "black",
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
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "8%",
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "grey",
    marginTop: 30,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceLabel: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "grey",
  },
});
