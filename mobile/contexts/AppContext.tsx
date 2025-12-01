import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

type AppContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Keep system preference reasonably in sync if using 'system'
  useEffect(() => {
    if (themeMode !== 'system') return;
    const listener = ({ colorScheme }: { colorScheme: 'light' | 'dark' | null }) => {
      // no-op for now; useTheme will read system when mode === 'system'
      // keeping listener here allows us to react if we decide to update UI on change
    };

    const sub = Appearance.addChangeListener(listener as any);
    return () => sub.remove();
  }, [themeMode]);

  return (
    <AppContext.Provider value={{ themeMode, setThemeMode }}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export default AppContext;
