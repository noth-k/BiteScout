import {
  TouchableOpacity,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import colors from "@assets/colors";
import React, { forwardRef } from "react";

type ButtonProps = {
  text: string;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} & React.ComponentPropsWithoutRef<typeof TouchableOpacity>;

const Button = forwardRef<View | null, ButtonProps>(
  ({ text, buttonStyle, textStyle, ...touchableOpacityProps }, ref) => {
    return (
      <TouchableOpacity
        {...touchableOpacityProps}
        style={[styles.container, buttonStyle]}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
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
