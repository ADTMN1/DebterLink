import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../hooks/useTheme';
import { Spacing, Colors } from '../constants/theme';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={[styles.container, { backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot }]}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
      />
      <ThemedText style={styles.title}>ደብተርLink</ThemedText>
      <ThemedText style={[styles.subtitle, { color: theme?.textSecondary || Colors.light.textSecondary }]}>
        Smart Education Hub
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
  },
});
