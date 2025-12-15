import { useCallback, useRef, useEffect, useState } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';

export interface FormAnalytics {
  startTime: number;
  fieldFocusTimes: Record<string, number>;
  fieldCompletionTimes: Record<string, number>;
  errorCount: number;
  retryCount: number;
}

export function useFormAnalytics<T extends FieldValues>(form: UseFormReturn<T>) {
  const [startTime] = useState(() => Date.now());
  const analytics = useRef<FormAnalytics>({
    startTime,
    fieldFocusTimes: {},
    fieldCompletionTimes: {},
    errorCount: 0,
    retryCount: 0,
  });

  const trackFieldFocus = useCallback((fieldName: string) => {
    analytics.current.fieldFocusTimes[fieldName] = Date.now();
  }, []);

  const trackFieldCompletion = useCallback((fieldName: string) => {
    const focusTime = analytics.current.fieldFocusTimes[fieldName];
    if (focusTime) {
      analytics.current.fieldCompletionTimes[fieldName] = Date.now() - focusTime;
    }
  }, []);

  const trackError = useCallback(() => {
    analytics.current.errorCount++;
  }, []);

  const trackRetry = useCallback(() => {
    analytics.current.retryCount++;
  }, []);

  const getFormMetrics = useCallback(() => {
    const totalTime = Date.now() - startTime;
    const avgFieldTime = Object.values(analytics.current.fieldCompletionTimes)
      .reduce((sum, time) => sum + time, 0) / Object.keys(analytics.current.fieldCompletionTimes).length || 0;

    return {
      totalTime,
      avgFieldTime,
      errorCount: analytics.current.errorCount,
      retryCount: analytics.current.retryCount,
      completedFields: Object.keys(analytics.current.fieldCompletionTimes).length,
    };
  }, []);

  // Track form errors
  useEffect(() => {
    const errorCount = Object.keys(form.formState.errors).length;
    if (errorCount > 0) {
      trackError();
    }
  }, [form.formState.errors, trackError]);

  return {
    trackFieldFocus,
    trackFieldCompletion,
    trackError,
    trackRetry,
    getFormMetrics,
  };
}