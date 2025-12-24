import * as z from 'zod';

// 1. Sanitization functions
export const sanitizers = {
  text: (input: string): string => {
    return input
      .trim()
      .replace(/[<>"']/g, '') 
      .replace(/javascript:/gi, '') 
      .replace(/on\w+=/gi, '') 
      .replace(/data:/gi, '') 
      .replace(/[\u0000]/g, '') 
      .substring(0, 1000);
  },

  name: (input: string): string => {
    return input
      .trim()
      .replace(/[^a-zA-Z\s\u1200-\u137F'-]/g, '') 
      .replace(/\s+/g, ' ') 
      .substring(0, 100);
  },

  email: (input: string): string => {
    return input.trim().toLowerCase().substring(0, 255);
  },

  phone: (input: string): string => {
    return input.replace(/[^\d+\s()-]/g, '').substring(0, 20);
  },

  school_name: (val: string) => val.trim(),
  academic_year: (val: string) => val.trim(),
  
  fullName: (val: string) => 
    val.trim()
       .toLowerCase()
       .replace(/\s+/g, ' ')
       .split(' ')
       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
       .join(' '),

  code: (input: string): string => {
    return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 20);
  },

  address: (input: string): string => {
    return input.trim().replace(/[<>"']/g, '').replace(/\s+/g, ' ').substring(0, 200);
  },

  username: (input: string): string => {
    return input.trim().toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 50);
  },
};

// 2. Enhanced Zod Helpers
export const sanitizedString = (sanitizer: keyof typeof sanitizers) => 
  z.string().transform((val) => sanitizers[sanitizer](val));

// 3. THE FIX: The Schema
export const registerSchoolAndAdminSchema = z.object({
  // Sanitized Fields (Good for SELECT 1 efficiency)
  school_name: sanitizedString('school_name'),
  code: sanitizedString('code'),
  school_email: sanitizedString('email'),
  school_phone: sanitizedString('phone'),
  address: sanitizedString('address'),
  academic_year: sanitizedString('academic_year'),
  status: z.string(),
  website: z.string().url().optional().or(z.literal('')),
  
  fullName: sanitizedString('fullName'),
  admin_email: sanitizedString('email'),
  admin_phone: sanitizedString('phone'),
  role: z.string(),

  
  password: z.string()
    .trim() 
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and a number'),
    
  confirmed_password: z.string().trim()
})
.refine((data) => data.password === data.confirmed_password, {
  message: "Passwords don't match",
  path: ["confirmed_password"], 
});

// 4. Form Data Sanitizer Utility
export const sanitizeFormData = <T extends Record<string, any>>(
  data: T,
  sanitizationMap: Partial<Record<keyof T, keyof typeof sanitizers>>
): T => {
  const sanitized = { ...data };
  Object.entries(sanitizationMap).forEach(([field, sanitizerKey]) => {
    if (sanitized[field] && typeof sanitized[field] === 'string' && sanitizerKey) {
      (sanitized as any)[field] = sanitizers[sanitizerKey](sanitized[field] as string);
    }  
  }); 
  return sanitized;
};