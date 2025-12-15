const isAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isAvailable()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silent fail
    }
  },
  removeItem: (key: string): void => {
    if (!isAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silent fail
    }
  },
  clear: (): void => {
    if (!isAvailable()) return;
    try {
      localStorage.clear();
    } catch {
      // Silent fail
    }
  }
};
