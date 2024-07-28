import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import colors from "@assets/colors";

type VibeContainerProps = {
  selected?: boolean;
  vibe: String;
  testID?: string;
  onPress: () => void;
};

const VibeContainer = ({
  selected,
  vibe,
  onPress,
  testID,
}: VibeContainerProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
      onPress={onPress}
      testID={testID}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.selectedLabel : styles.unselectedLabel,
        ]}
      >
        {vibe}
      </Text>
    </TouchableOpacity>
  );
};

export default VibeContainer;

const styles = StyleSheet.create({
  container: {
    borderColor: "lightgrey",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  selectedContainer: {
    backgroundColor: colors.primary400,
    borderWidth: 1,
    borderColor: colors.primary400,
  },
  unselectedContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: "400",
  },
  selectedLabel: {
    color: "white",
  },
  unselectedLabel: {
    color: "black",
  },
});
