import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useApp } from "@/contexts/AppContext";

export function useTheme() {
  const colorScheme = useColorScheme();
  const { themeMode } = useApp();

  // decide scheme based on app preference (light/dark/system)
  const effectiveScheme = themeMode === 'system' ? colorScheme ?? 'light' : themeMode;
  const isDark = effectiveScheme === "dark";
  
  // Defensive: ensure we always return a valid theme
  let theme = Colors.light; // Default fallback
  try {
    const scheme = effectiveScheme ?? "light";
    if (scheme === "dark" && Colors.dark) {
      theme = Colors.dark;
    } else if (scheme === "light" && Colors.light) {
      theme = Colors.light;
    }
  } catch (error) {
    // If anything fails, use light theme
    theme = Colors.light;
  }

  return {
    theme,
    isDark,
  };
}
