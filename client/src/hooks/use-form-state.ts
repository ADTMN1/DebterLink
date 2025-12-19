import { useState, useCallback } from 'react';

// Form state management hook
export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<keyof T>>(new Set());

  const updateField = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setTouchedFields(prev => new Set(prev).add(field));
  }, []);

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    Object.keys(updates).forEach(key => {
      setTouchedFields(prev => new Set(prev).add(key as keyof T));
    });
  }, []);

  const resetForm = useCallback((newState?: T) => {
    setFormData(newState || initialState);
    setIsDirty(false);
    setTouchedFields(new Set());
  }, [initialState]);

  const markFieldTouched = useCallback((field: keyof T) => {
    setTouchedFields(prev => new Set(prev).add(field));
  }, []);

  const isFieldTouched = useCallback((field: keyof T) => {
    return touchedFields.has(field);
  }, [touchedFields]);

  return {
    formData,
    isDirty,
    touchedFields,
    updateField,
    updateFields,
    resetForm,
    markFieldTouched,
    isFieldTouched,
  };
}

// Form wizard/multi-step hook
export function useFormWizard<T extends Record<string, any>>(
  steps: Array<{ name: string; fields: (keyof T)[] }>,
  initialData: T
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { formData, updateField, updateFields, resetForm } = useFormState(initialData);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const isStepValid = useCallback((stepIndex: number, errors: Record<string, string>) => {
    const stepFields = steps[stepIndex]?.fields || [];
    return stepFields.every(field => !errors[field as string]);
  }, [steps]);

  const getCurrentStepFields = useCallback(() => {
    return steps[currentStep]?.fields || [];
  }, [steps, currentStep]);

  return {
    currentStep,
    completedSteps,
    formData,
    updateField,
    updateFields,
    resetForm,
    nextStep,
    prevStep,
    goToStep,
    isStepValid,
    getCurrentStepFields,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
  };
}