import { useState, useCallback } from 'react';
import { debounce } from 'lodash';

// Async validation hook for server-side validation
export function useAsyncValidation() {
  const [validating, setValidating] = useState<Record<string, boolean>>({});
  const [asyncErrors, setAsyncErrors] = useState<Record<string, string>>({});

  const validateAsync = useCallback(
    debounce(async (
      fieldName: string,
      value: string,
      validator: (value: string) => Promise<string | null>
    ) => {
      if (!value.trim()) return;

      setValidating(prev => ({ ...prev, [fieldName]: true }));
      
      try {
        const error = await validator(value);
        setAsyncErrors(prev => ({ ...prev, [fieldName]: error || '' }));
      } catch (error) {
        setAsyncErrors(prev => ({ ...prev, [fieldName]: 'Validation failed' }));
      } finally {
        setValidating(prev => ({ ...prev, [fieldName]: false }));
      }
    }, 500),
    []
  );

  const clearAsyncError = useCallback((fieldName: string) => {
    setAsyncErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  return { validating, asyncErrors, validateAsync, clearAsyncError };
}

// Common async validators
export const asyncValidators = {
  checkUsernameAvailable: async (username: string): Promise<string | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const unavailable = ['admin', 'test', 'user'];
    return unavailable.includes(username.toLowerCase()) 
      ? 'Username is already taken' 
      : null;
  },

  checkEmailAvailable: async (email: string): Promise<string | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    const unavailable = ['admin@school.com', 'test@school.com'];
    return unavailable.includes(email.toLowerCase()) 
      ? 'Email is already registered' 
      : null;
  },

  validateStudentId: async (studentId: string): Promise<string | null> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    return studentId.length < 5 ? 'Invalid student ID' : null;
  },
};