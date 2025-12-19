import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { safeLocalStorage } from '@/lib/safe-storage';

// Form persistence hook for auto-save functionality
export function useFormPersistence<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  key: string,
  options: {
    debounceMs?: number;
    exclude?: (keyof T)[];
    onSave?: (data: T) => void;
    onRestore?: (data: T) => void;
  } = {}
) {
  const { debounceMs = 1000, exclude = [], onSave, onRestore } = options;

  // Save form data to localStorage
  const saveToStorage = useCallback((data: T) => {
    const filteredData = { ...data };
    exclude.forEach(field => delete filteredData[field]);
    safeLocalStorage.setItem(`form_${key}`, JSON.stringify(filteredData));
    onSave?.(data);
  }, [key, exclude, onSave]);

  // Restore form data from localStorage
  const restoreFromStorage = useCallback(() => {
    const saved = safeLocalStorage.getItem(`form_${key}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        form.reset(data, { keepDefaultValues: true });
        onRestore?.(data);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }, [key, form.reset, onRestore]);

  // Clear saved data
  const clearStorage = useCallback(() => {
    safeLocalStorage.removeItem(`form_${key}`);
  }, [key]);

  // Auto-save on form changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = form.watch((data) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (form.formState.isDirty) {
          saveToStorage(data as T);
        }
      }, debounceMs);
    });

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [form.watch, form.formState.isDirty, saveToStorage, debounceMs]);

  // Restore on mount
  useEffect(() => {
    const restored = restoreFromStorage();
    if (!restored) {
      // Only run once on mount
    }
  }, []);

  return { saveToStorage, restoreFromStorage, clearStorage };
}

// Draft management hook
export function useDraftManagement<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  draftKey: string
) {
  const saveDraft = useCallback(() => {
    const data = form.getValues();
    safeLocalStorage.setItem(`draft_${draftKey}`, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  }, [form, draftKey]);

  const loadDraft = useCallback(() => {
    const saved = safeLocalStorage.getItem(`draft_${draftKey}`);
    if (saved) {
      try {
        const { data, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          form.reset(data, { keepDefaultValues: true });
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }, [form.reset, draftKey]);

  const deleteDraft = useCallback(() => {
    safeLocalStorage.removeItem(`draft_${draftKey}`);
  }, [draftKey]);

  const hasDraft = useCallback(() => {
    const saved = safeLocalStorage.getItem(`draft_${draftKey}`);
    if (saved) {
      try {
        const { timestamp } = JSON.parse(saved);
        return Date.now() - timestamp < 24 * 60 * 60 * 1000;
      } catch {
        return false;
      }
    }
    return false;
  }, [draftKey]);

  return { saveDraft, loadDraft, deleteDraft, hasDraft };
}