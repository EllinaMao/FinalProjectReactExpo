import React, { PropsWithChildren } from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

type ButtonProps = PropsWithChildren<
  TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
  }
>;

export const Button = ({ children, style, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.baseButton, style]} {...rest}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    backgroundColor: "#74b999",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: "center",
  },
});
