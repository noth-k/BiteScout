import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignUpContext } from '@/providers/SignUpProvider';
import { FontAwesome } from "@expo/vector-icons";

const preferencesVector = require("@assets/images/preferences.png");

interface Cuisine {
  image: number;
  name: string;
}

const cuisines: Cuisine[] = [
  { image: require('@assets/images/japanese_1.jpg'), name: "Japanese" },
  { image: require('@assets/images/japanese_2.jpg'), name: "Japanese" },
  { image: require('@assets/images/korean_1.jpg'), name: "Korean" },
  { image: require('@assets/images/korean_2.jpg'), name: "Korean" },
  { image: require('@assets/images/mexican_1.jpg'), name: "Mexican" },
  { image: require('@assets/images/mexican_2.jpg'), name: "Mexican" },
  { image: require('@assets/images/italian_1.jpg'), name: "Italian" },
  { image: require('@assets/images/italian_2.jpg'), name: "Italian" },
  { image: require('@assets/images/indian_1.jpg'), name: "Indian" },
  { image: require('@assets/images/indian_2.jpg'), name: "Indian" },
];

const SignupPreferences: React.FC = () => {
  const router = useRouter();
  const [currentPair, setCurrentPair] = useState<[number, number]>([0, 1]);
  const [selections, setSelections] = useState<string[]>([]);
  const { dispatch } = useSignUpContext();

//selects 2 random images to display, which ever is choosen to sent to an array. 
//Sebsequently, more of such images will be shown along with other cuisine images to compare
//after 10 tries, the selection will happen based on the highest frequency


  useEffect(() => {
    if (selections.length === 10) {
      const topPreferences = getTopPreferences(selections);
      dispatch({
        type: "ADD_PREFERENCES",
        payload: topPreferences,
      });
      router.push("./signUpRestrictions");
    }
  }, [selections]);

  const getTopPreferences = (selections: string[]): string[] => {
    const frequency: { [key: string]: number } = {};
    selections.forEach((selection) => {
      frequency[selection] = (frequency[selection] || 0) + 1;
    });
    return Object.keys(frequency)
      .sort((a, b) => frequency[b] - frequency[a])
      .slice(0, 5);
  };

  const handleSelection = (selected: number) => {
    setSelections([...selections, cuisines[selected].name]);
    let nextPair: [number, number];
    do {
      nextPair = getWeightedRandomPair();
    } while (nextPair[0] === nextPair[1]);
    setCurrentPair(nextPair);
  };


  const getWeightedRandomPair = (): [number, number] => {
    const weightedCuisines: number[] = [];
    const selectionCount: { [key: string]: number } = {};

    selections.forEach((selection) => {
      selectionCount[selection] = (selectionCount[selection] || 0) + 1;
    });

    cuisines.forEach((cuisine, index) => {
      const count = selectionCount[cuisine.name] || 0;
      for (let i = 0; i <= count; i++) {
        weightedCuisines.push(index);
      }
    });

    const firstIndex = weightedCuisines[Math.floor(Math.random() * weightedCuisines.length)];
    let secondIndex;
    do {
      secondIndex = Math.floor(Math.random() * cuisines.length);
    } while (cuisines[firstIndex].name === cuisines[secondIndex].name);

    return [firstIndex, secondIndex];
  };

  const handleBack = () => {
    dispatch({
      type: "REMOVE_PREFERENCES",
      payload: [],
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ backgroundColor: 'white', height: "100%" }}>
      <FontAwesome
        name="angle-left"
        style={styles.back}
        onPress={handleBack}
        testID='back-button'
      />
      <Image source={preferencesVector} style={styles.title} />
      <Text style={{fontFamily:"Inter", textAlign:"center", fontSize:15}}>{'Which cuisine would you rather: \n Dish or Ditch'}</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handleSelection(currentPair[0])} testID='vinoth_greatest_1'>
          <Image source={cuisines[currentPair[0]].image} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity onPress={() => handleSelection(currentPair[1])} testID='vinoth_greatest_2'>
          <Image source={cuisines[currentPair[1]].image} style={styles.image} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupPreferences;

const styles = StyleSheet.create({
  back: {
    marginLeft: 20,
    fontSize: 30,
  },
  title: {
    height: 180,
    width: 330,
    alignSelf: "center",
    justifyContent: 'flex-start',
  },
  imageContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  orText: {
    fontSize: 18,
    fontWeight: '400',
    marginVertical:20,
  },
});
