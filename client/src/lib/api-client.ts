import { useRetry } from '@/hooks/use-retry';
import { useErrorHandler } from '@/hooks/use-error-handler';

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as Error & { status?: number; shouldRetry?: boolean };
        error.status = response.status;
        error.shouldRetry = response.status >= 500 || response.status === 429;
        throw error;
      }

      return response.json();
    } catch (error: unknown) {
      const err = error as Error & { name?: string; message?: string; shouldRetry?: boolean };
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        err.shouldRetry = true;
      }
      throw err;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

// Hook for API calls with retry and error handling
export function useApiCall<T extends unknown[], R>(
  apiFunction: (...args: T) => Promise<R>
) {
  const { execute, isRetrying, attemptCount } = useRetry(apiFunction, {
    maxAttempts: 3,
    delay: 1000,
    backoff: true,
  });
  
  const { handleError } = useErrorHandler({
    showToast: true,
    logError: true,
  });

  const callApi = async (...args: T): Promise<R | null> => {
    try {
      return await execute(...args);
    } catch (error) {
      handleError(error, 'API call');
      return null;
    }
  };

  return { callApi, isRetrying, attemptCount };
}