import { View, type ViewProps } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const themeResult = useTheme();
  const theme =
    themeResult && themeResult.theme ? themeResult.theme : Colors.light;
  const isDark = themeResult?.isDark || false;

  const backgroundColor =
    isDark && darkColor
      ? darkColor
      : !isDark && lightColor
        ? lightColor
        : theme?.backgroundRoot || Colors.light.backgroundRoot;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
