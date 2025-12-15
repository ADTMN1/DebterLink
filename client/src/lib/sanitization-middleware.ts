import { FormSanitizer } from './form-sanitizer';

/**
 * Sanitization middleware for API requests
 */
export class SanitizationMiddleware {
  /**
   * Sanitize request data before sending to API
   */
  static sanitizeRequest<T extends Record<string, any>>(data: T): T {
    return FormSanitizer.sanitizeForm(data);
  }

  /**
   * Intercept and sanitize fetch requests
   */
  static createSanitizedFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.body && init?.method && ['POST', 'PUT', 'PATCH'].includes(init.method.toUpperCase())) {
        try {
          const bodyData = JSON.parse(init.body as string);
          const sanitizedData = this.sanitizeRequest(bodyData);
          init.body = JSON.stringify(sanitizedData);
        } catch (error) {
          // If body is not JSON, leave it as is
        }
      }
      
      return originalFetch(input, init);
    };
  }

  /**
   * Restore original fetch function
   */
  static restoreOriginalFetch() {
    // This would need to store the original fetch reference
    // Implementation depends on specific requirements
  }
}

/**
 * Initialize global sanitization
 */
export function initializeGlobalSanitization() {
  // Apply sanitization middleware to fetch requests
  SanitizationMiddleware.createSanitizedFetch();
  
  // Add global event listeners for form submissions
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    if (form && form.tagName === 'FORM') {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = FormSanitizer.sanitizeField(key, value);
        }
      });
      
      // Update form fields with sanitized values
      Object.entries(data).forEach(([key, value]) => {
        const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
        if (input && input.value !== value) {
          input.value = value;
        }
      });
    }
  });
}

/**
 * Sanitization decorator for class methods
 */
export function sanitizeInput(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    const sanitizedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
        return FormSanitizer.sanitizeForm(arg);
      }
      return arg;
    });
    
    return method.apply(this, sanitizedArgs);
  };
  
  return descriptor;
}