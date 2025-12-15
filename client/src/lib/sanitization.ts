import * as z from 'zod';

// Sanitization functions
export const sanitizers = {
  // Basic text sanitization
  text: (input: string): string => {
    return input
      .trim()
      .replace(/[<>"']/g, '') // Remove HTML tags and quotes
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/[\u0000]/g, '') // Remove null bytes
      .substring(0, 1000);
  },

  // Name sanitization (allows letters, spaces, hyphens, apostrophes)
  name: (input: string): string => {
    return input
      .trim()
      .replace(/[^a-zA-Z\s\u1200-\u137F'-]/g, '') // Allow English, Amharic, spaces, hyphens, apostrophes
      .replace(/\s+/g, ' ') // Normalize multiple spaces
      .substring(0, 100);
  },

  // Email sanitization
  email: (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .substring(0, 255);
  },

  // Username sanitization
  username: (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '') // Only allow alphanumeric, dots, underscores, hyphens
      .substring(0, 50);
  },

  // Phone sanitization
  phone: (input: string): string => {
    return input
      .replace(/[^\d+\s()-]/g, '') // Allow digits, +, spaces, parentheses, hyphens
      .replace(/\s+/g, '') // Remove all spaces
      .substring(0, 20);
  },

  // Description/Message sanitization
  description: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/[\u0000]/g, '') // Remove null bytes
      .substring(0, 5000);
  },

  // Code sanitization (subject codes, class codes)
  code: (input: string): string => {
    return input
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') // Only allow uppercase letters and numbers
      .substring(0, 20);
  },

  // Grade sanitization
  grade: (input: string): string => {
    const cleaned = input.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned);
    if (num >= 9 && num <= 12) return num.toString();
    return '';
  },

  // Section sanitization
  section: (input: string): string => {
    return input
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 1);
  },

  // Address sanitization
  address: (input: string): string => {
    return input
      .trim()
      .replace(/[<>"']/g, '') // Remove dangerous characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .substring(0, 200);
  },
};

// Enhanced Zod schemas with built-in sanitization
export const sanitizedString = (sanitizer: keyof typeof sanitizers) => 
  z.string().transform((val) => sanitizers[sanitizer](val));

export const sanitizedOptionalString = (sanitizer: keyof typeof sanitizers) => 
  z.string().optional().transform((val) => val ? sanitizers[sanitizer](val) : val);

// Pre-sanitized validation schemas
export const sanitizedSchemas = {
  name: z.string().transform((val) => sanitizers.name(val)).pipe(z.string().min(2, 'Name must be at least 2 characters')),
  email: z.string().transform((val) => sanitizers.email(val)).pipe(z.string().email('Please enter a valid email address')),
  username: z.string().transform((val) => sanitizers.username(val)).pipe(z.string().min(3, 'Username must be at least 3 characters')),
  phone: z.string().transform((val) => sanitizers.phone(val)).pipe(z.string().regex(/^\+251[0-9]{9}$/, 'Please enter a valid Ethiopian phone number')),
  description: z.string().transform((val) => sanitizers.description(val)).pipe(z.string().min(10, 'Description must be at least 10 characters')),
  code: z.string().transform((val) => sanitizers.code(val)).pipe(z.string().min(2, 'Code must be at least 2 characters')),
  grade: z.string().transform((val) => sanitizers.grade(val)).pipe(z.string().regex(/^(9|10|11|12)$/, 'Grade must be 9, 10, 11, or 12')),
  section: z.string().transform((val) => sanitizers.section(val)).pipe(z.string().regex(/^[A-Z]$/, 'Section must be a single uppercase letter')),
  address: z.string().transform((val) => sanitizers.address(val)).pipe(z.string().min(5, 'Address must be at least 5 characters')),
  text: z.string().transform((val) => sanitizers.text(val)).pipe(z.string().min(1, 'This field is required')),
};

// Sanitize form data before submission
export const sanitizeFormData = <T extends Record<string, any>>(
  data: T,
  sanitizationMap: Partial<Record<keyof T, keyof typeof sanitizers>>
): T => {
  const sanitized = { ...data };
  
  Object.entries(sanitizationMap).forEach(([field, sanitizerKey]) => {
    if (sanitized[field] && typeof sanitized[field] === 'string' && sanitizerKey) {
      sanitized[field] = sanitizers[sanitizerKey](sanitized[field]);
    }
  });
  
  return sanitized;
};