import React from 'react';
import { View, Text } from 'react-native';

const DiningPlaces = ({ selectedPrice, selectedVibe, testID }) => (
  <View testID={testID || 'diningPlaces'}>
    <Text testID="selectedVibe">{selectedVibe}</Text>
    <Text testID="selectedPrice">{selectedPrice}</Text>
  </View>
);

export default DiningPlaces;
