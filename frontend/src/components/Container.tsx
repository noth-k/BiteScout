import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { Vibe } from "@/types";
import colors from "@assets/colors";
import { ViewProps } from "./Themed";

type ContainerProps = {
  item: String;
  buttonStyle?: StyleProp<ViewStyle>;
};

const Container = ({ item, buttonStyle }: ContainerProps) => {
  return (
    <View style={[styles.container, buttonStyle]}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.primary800,
    borderRadius: 5,
  },
  text: {
    fontFamily: "Inter",
    fontWeight: "300",
    color: "white",
    textAlign: "center",
  },
});
