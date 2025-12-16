import { useState, useCallback, useEffect } from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { debounce } from 'lodash';

export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

export interface FieldValidationState {
  state: ValidationState;
  message?: string;
  progress?: number;
}

export function useRealtimeValidation<T extends FieldValues>(form: UseFormReturn<T>) {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldValidationState>>({});
  const [formProgress, setFormProgress] = useState(0);

  const updateFieldState = useCallback((field: string, state: FieldValidationState) => {
    setFieldStates(prev => ({ ...prev, [field]: state }));
  }, []);

  const validateField = useCallback(
    debounce(async (fieldName: FieldPath<T>, value: unknown) => {
      if (!value) {
        updateFieldState(fieldName, { state: 'idle' });
        return;
      }

      updateFieldState(fieldName, { state: 'validating' });

      try {
        // Trigger field validation
        const isValid = await form.trigger(fieldName);
        const error = form.formState.errors[fieldName];

        updateFieldState(fieldName, {
          state: isValid ? 'valid' : 'invalid',
          message: error?.message as string,
        });
      } catch (error) {
        updateFieldState(fieldName, {
          state: 'invalid',
          message: 'Validation failed',
        });
      }
    }, 300),
    [form, updateFieldState]
  );

  // Calculate form completion progress
  useEffect(() => {
    const subscription = form.watch((values) => {
      const fields = Object.keys(values);
      const completedFields = fields.filter(field => {
        const value = values[field as keyof T];
        return value && String(value).trim() !== '';
      });
      
      const progress = fields.length > 0 ? (completedFields.length / fields.length) * 100 : 0;
      setFormProgress(Math.round(progress));
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const getFieldState = useCallback((field: string): FieldValidationState => {
    return fieldStates[field] || { state: 'idle' };
  }, [fieldStates]);

  const isFormValid = useCallback(() => {
    return Object.values(fieldStates).every(state => 
      state.state === 'valid' || state.state === 'idle'
    );
  }, [fieldStates]);

  return {
    fieldStates,
    formProgress,
    validateField,
    updateFieldState,
    getFieldState,
    isFormValid,
  };
}