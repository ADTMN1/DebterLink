import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  language: 'en' | 'am' | 'or';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  calendarType: 'gregorian' | 'ethiopian';
  setLanguage: (lang: 'en' | 'am' | 'or') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCalendarType: (type: 'gregorian' | 'ethiopian') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      sidebarOpen: true,
      calendarType: 'gregorian',
      setLanguage: (lang) => set({ language: lang }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCalendarType: (type) => set({ calendarType: type }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
