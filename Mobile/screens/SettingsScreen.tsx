import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing } from '../constants/theme';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const current = theme ?? Colors.light;

  return (
    <ScreenScrollView>
      <View style={[styles.container, { backgroundColor: current.backgroundRoot || Colors.light.backgroundRoot }]}> 
        <ThemedText type="h1">Settings</ThemedText>
        <ThemedText style={styles.p}>This is a small settings screen — wire real preferences here.</ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  p: {
    marginTop: Spacing.md,
  }
});
