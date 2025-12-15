import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { 
    showToast = true, 
    logError = true, 
    fallbackMessage = 'An unexpected error occurred' 
  } = options;

  const handleError = useCallback((error: unknown, context?: string) => {
    let message = fallbackMessage;
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    // Log error for debugging
    if (logError) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    }

    // Show user-friendly toast
    if (showToast) {
      toast.error(getUserFriendlyMessage(message));
    }

    return message;
  }, [showToast, logError, fallbackMessage]);

  return { handleError };
}

function getUserFriendlyMessage(error: string): string {
  const errorMap: Record<string, string> = {
    'Network Error': 'Please check your internet connection and try again.',
    'Failed to fetch': 'Unable to connect to the server. Please try again.',
    'Unauthorized': 'Your session has expired. Please log in again.',
    'Forbidden': 'You do not have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'Server error. Please try again later.',
    'Bad Request': 'Invalid request. Please check your input.',
    'Validation Error': 'Please check your input and try again.',
  };

  // Check for specific error patterns
  for (const [pattern, message] of Object.entries(errorMap)) {
    if (error.includes(pattern)) {
      return message;
    }
  }

  // Return original message if no pattern matches
  return error;
}