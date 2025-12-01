import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LanguageSelectionScreen({ onComplete }: { onComplete: () => void }) {
  const themeResult = useTheme();
  const theme = (themeResult && themeResult.theme) ? themeResult.theme : Colors.light;
  const { language, setLanguage } = useAuth();
  const insets = useSafeAreaInsets();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'am' as const, name: 'አማርኛ', flag: '🇪🇹' },
    { code: 'or' as const, name: 'Afaan Oromo', flag: '🇪🇹' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme?.backgroundRoot || Colors.light.backgroundRoot, paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Select Language</ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme?.textSecondary || Colors.light.textSecondary }]}>
          Choose your preferred language
        </ThemedText>

        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => setLanguage(lang.code)}
              style={({ pressed }: { pressed: boolean }) => [
                styles.languageCard,
                {
                  backgroundColor: language === lang.code ? (theme?.info || Colors.light.info) : (theme?.backgroundDefault || Colors.light.backgroundDefault),
                  borderColor: language === lang.code ? (theme?.info || Colors.light.info) : (theme?.border || Colors.light.border),
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ThemedText style={styles.flag}>{lang.flag}</ThemedText>
              <ThemedText style={[
                styles.languageName,
                { color: language === lang.code ? '#FFFFFF' : (theme?.text || Colors.light.text) }
              ]}>
                {lang.name}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={onComplete}>Continue</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  languageGrid: {
    gap: Spacing.md,
  },
  languageCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flag: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});
