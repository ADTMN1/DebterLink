import { useState, useCallback } from 'react';
import { sanitizers } from '@/lib/sanitization';

// Individual field validation hook
export function useFieldValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((
    name: string,
    value: string,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: string) => string | null;
      sanitizer?: keyof typeof sanitizers;
    }
  ) => {
    let error = '';

    // Sanitize first if sanitizer provided
    const sanitizedValue = rules.sanitizer ? sanitizers[rules.sanitizer](value) : value;

    if (rules.required && !sanitizedValue.trim()) {
      error = 'This field is required';
    } else if (rules.minLength && sanitizedValue.length < rules.minLength) {
      error = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
      error = `Maximum ${rules.maxLength} characters allowed`;
    } else if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
      error = 'Invalid format';
    } else if (rules.custom) {
      error = rules.custom(sanitizedValue) || '';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return { isValid: !error, sanitizedValue, error };
  }, []);

  const clearError = useCallback((name: string) => {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validateField, clearError, clearAllErrors };
}

// Pre-configured field validators
export const fieldValidators = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    sanitizer: 'email' as const,
  },
  phone: {
    required: true,
    pattern: /^\+251[0-9]{9}$/,
    sanitizer: 'phone' as const,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    sanitizer: 'name' as const,
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-z0-9._-]+$/,
    sanitizer: 'username' as const,
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain uppercase, lowercase, and number';
      }
      return null;
    },
  },
  grade: {
    required: true,
    pattern: /^(9|10|11|12)$/,
    sanitizer: 'grade' as const,
  },
  section: {
    required: true,
    pattern: /^[A-Z]$/,
    sanitizer: 'section' as const,
  },
  code: {
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: /^[A-Z0-9]+$/,
    sanitizer: 'code' as const,
  },
  description: {
    maxLength: 5000,
    sanitizer: 'description' as const,
  },
  text: {
    required: true,
    minLength: 1,
    maxLength: 1000,
    sanitizer: 'text' as const,
  },
};