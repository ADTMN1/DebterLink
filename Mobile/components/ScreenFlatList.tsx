import React from "react";
import { FlatList, FlatListProps, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { useScreenInsets } from "@/hooks/useScreenInsets";
import { Spacing, Colors } from "@/constants/theme";

export function ScreenFlatList<T>({
  contentContainerStyle,
  style,
  ...flatListProps
}: FlatListProps<T>) {
  const themeResult = useTheme();
  const theme =
    themeResult && themeResult.theme ? themeResult.theme : Colors.light;
  const { paddingTop, paddingBottom, scrollInsetBottom } = useScreenInsets();

  return (
    <FlatList
      style={[
        styles.container,
        {
          backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot,
        },
        style,
      ]}
      contentContainerStyle={[
        {
          paddingTop,
          paddingBottom,
        },
        styles.contentContainer,
        contentContainerStyle,
      ]}
      scrollIndicatorInsets={{ bottom: scrollInsetBottom }}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.xl,
  },
});
