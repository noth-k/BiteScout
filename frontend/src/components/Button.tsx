import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Colors from "../constants/Colors";
import { forwardRef } from "react";
import colors from "@assets/colors";
import React from "react";

type ButtonProps = {
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, buttonStyle, textStyle, ...pressableProps }, ref) => {
    return (
      <Pressable
        ref={ref}
        {...pressableProps}
        style={[styles.container, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary800,
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 15,
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "400",
    color: "white",
  },
});

export default Button;
