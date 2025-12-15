import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
}

export function useRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options;
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const execute = useCallback(async (...args: T): Promise<R> => {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        setAttemptCount(attempts + 1);
        const result = await fn(...args);
        setAttemptCount(0);
        setIsRetrying(false);
        return result;
      } catch (error) {
        attempts++;
        
        if (attempts >= maxAttempts) {
          setIsRetrying(false);
          throw error;
        }
        
        setIsRetrying(true);
        const waitTime = backoff ? delay * Math.pow(2, attempts - 1) : delay;
        
        // Only show toast on final attempt to avoid spam
        if (attempts === maxAttempts - 1) {
          toast.error(`Request failed. Retrying one last time...`);
        }
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    throw new Error('Max retry attempts reached');
  }, [fn, maxAttempts, delay, backoff]);

  const retry = useCallback(() => {
    setAttemptCount(0);
    setIsRetrying(false);
  }, []);

  return { execute, isRetrying, attemptCount, retry };
}