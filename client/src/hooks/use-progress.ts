import { useState, useCallback } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const startProgress = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const updateProgress = useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setIsLoading(false);
  }, []);

  return {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    completeProgress,
    resetProgress,
  };
}
