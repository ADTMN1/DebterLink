import { sanitizers } from './sanitization';

/**
 * Global form sanitization utility
 * Automatically sanitizes form data based on field types
 */
export class FormSanitizer {
  private static fieldTypeMap: Record<string, keyof typeof sanitizers> = {
    // User fields
    name: 'name',
    fullName: 'name',
    firstName: 'name',
    lastName: 'name',
    username: 'username',
    email: 'email',
    phone: 'phone',
    address: 'address',
    
    // Academic fields
    subject: 'text',
    title: 'text',
    description: 'description',
    message: 'description',
    content: 'description',
    notes: 'description',
    
    // Code fields
    code: 'code',
    subjectCode: 'code',
    classCode: 'code',
    grade: 'grade',
    section: 'section',
    
    // Search and general text
    search: 'text',
    query: 'text',
    text: 'text',
    
    // Password fields (minimal sanitization)
    password: 'text',
    currentPassword: 'text',
    newPassword: 'text',
    confirmPassword: 'text',
  };

  /**
   * Sanitize a single field value
   */
  static sanitizeField(fieldName: string, value: string): string {
    if (typeof value !== 'string') return value;
    
    const sanitizerKey = this.fieldTypeMap[fieldName] || 'text';
    return sanitizers[sanitizerKey](value);
  }

  /**
   * Sanitize an entire form object
   */
  static sanitizeForm<T extends Record<string, any>>(formData: T): T {
    const sanitized = { ...formData };
    
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = this.sanitizeField(key, sanitized[key]);
      }
    });
    
    return sanitized;
  }

  /**
   * Create a sanitization map for a form based on field names
   */
  static createSanitizationMap<T extends Record<string, any>>(
    formData: T
  ): Partial<Record<keyof T, keyof typeof sanitizers>> {
    const map: Partial<Record<keyof T, keyof typeof sanitizers>> = {};
    
    Object.keys(formData).forEach(key => {
      const sanitizerKey = this.fieldTypeMap[key] || 'text';
      map[key as keyof T] = sanitizerKey;
    });
    
    return map;
  }

  /**
   * Register custom field type mappings
   */
  static registerFieldType(fieldName: string, sanitizerKey: keyof typeof sanitizers): void {
    this.fieldTypeMap[fieldName] = sanitizerKey;
  }

  /**
   * Get the sanitizer for a specific field
   */
  static getSanitizerForField(fieldName: string): keyof typeof sanitizers {
    return this.fieldTypeMap[fieldName] || 'text';
  }
}

/**
 * Higher-order component for automatic form sanitization
 */
export function withFormSanitization<T extends Record<string, any>>(
  onSubmit: (data: T) => void | Promise<void>
) {
  return async (data: T) => {
    const sanitizedData = FormSanitizer.sanitizeForm(data);
    await onSubmit(sanitizedData);
  };
}

/**
 * React hook for form sanitization
 */
export function useFormSanitization<T extends Record<string, any>>() {
  const sanitizeForm = (data: T): T => FormSanitizer.sanitizeForm(data);
  
  const sanitizeField = (fieldName: string, value: string): string => 
    FormSanitizer.sanitizeField(fieldName, value);
  
  const createSanitizationMap = (data: T) => 
    FormSanitizer.createSanitizationMap(data);
  
  return {
    sanitizeForm,
    sanitizeField,
    createSanitizationMap,
  };
}