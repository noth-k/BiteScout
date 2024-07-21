import colors from "@assets/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BubbleProps {
  text: string; // use 'string' instead of 'String'
}

const Bubble: React.FC<BubbleProps> = ({ text }) => {
  return (
    <View
      style={[
        styles.bubble,
        {
          backgroundColor: colors.primary800,
          width: text.length * 10 + 10,
          opacity: 0.7,
        },
      ]}
    >
      <Text style={styles.bubbleText}>{text}</Text>
    </View>
  );
};

interface ItemProps {
  items: string[]; // use 'string' instead of 'String'
  title: string; // use 'string' instead of 'String'
}

const BubbleHeader: React.FC<ItemProps> = ({ items = [], title }) => {
  // provide a default value for items
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <View style={styles.bubblesContainer}>
        {Array.isArray(items) ? (
          items.map((item, index) => <Bubble key={index} text={item} />)
        ) : (
          <Text>Error: items is not an array</Text>
        )}
      </View>
    </View>
  );
};

export default BubbleHeader;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 20,
  },
  bubblesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bubble: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#d3d3d3",
  },
  bubbleText: {
    fontSize: 14,
    alignSelf: "center",
    color: "white",
  },
});
