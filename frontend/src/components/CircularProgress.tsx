import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import colors from '@assets/colors'; // Make sure colors are correctly imported

type SubmittedUsersBarProps = {
  userCount: number,
  submitCount: number,
  backgroundColor?: string,
  style: StyleProp<ViewStyle>
}

const CircularProgress = ({ userCount, submitCount, backgroundColor, style }: SubmittedUsersBarProps) => {
  return (
    <View style={[styles.main, { backgroundColor: backgroundColor ?? 'white' }, style]}>
      <View style={styles.inner}>
        <Text style={styles.text}>{submitCount} / {userCount}</Text>
      </View>
    </View>
  );
}

export default CircularProgress;

const styles = StyleSheet.create({
  main: {
    borderRadius: 80,
    height: 150,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center', // Added alignItems to center the text horizontally
  },
  inner: {
    borderRadius: 80,
    backgroundColor: colors.primary400, // Make sure colors.primary400 is defined in your assets
    height: 130,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'Inter',
    textAlign: 'center',
    fontWeight:'bold'
  },
});
