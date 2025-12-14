import React, { ReactNode, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Colors } from "@/constants/theme";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function Button({
  onPress,
  children,
  style,
  disabled = false,
}: ButtonProps) {
  const themeResult = useTheme();
  const theme = themeResult?.theme || Colors.light;

  // Animated scale value (replaces Reanimated shared value)
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 25,
      bounciness: 6,
    }).start();
  };

  const handlePressIn = () => {
    if (!disabled) animateTo(0.97);
  };

  const handlePressOut = () => {
    if (!disabled) animateTo(1);
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: theme?.link || Colors.light.link,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <ThemedText
          type="body"
          style={[
            styles.buttonText,
            { color: theme?.buttonText || Colors.light.buttonText },
          ]}
        >
          {children}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    fontWeight: "600",
  },
});
