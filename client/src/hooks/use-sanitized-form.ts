import { useForm, UseFormProps, FieldValues, UseFormReturn } from 'react-hook-form';
import { sanitizeFormData, sanitizers } from '@/lib/sanitization';

interface UseSanitizedFormProps<T extends FieldValues> extends UseFormProps<T> {
  sanitizationMap?: Partial<Record<keyof T, keyof typeof sanitizers>>;
}

export function useSanitizedForm<T extends FieldValues>({
  sanitizationMap = {},
  ...formProps
}: UseSanitizedFormProps<T>): UseFormReturn<T> & {
  handleSanitizedSubmit: (onValid: (data: T) => void | Promise<void>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
} {
  const form = useForm<T>(formProps);

  const handleSanitizedSubmit = (onValid: (data: T) => void | Promise<void>) => {
    return form.handleSubmit(async (data) => {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(data, sanitizationMap);
      
      // Call the original submit handler with sanitized data
      await onValid(sanitizedData);
    });
  };

  return {
    ...form,
    handleSanitizedSubmit,
  };
}

// Pre-configured sanitization maps for common forms
export const sanitizationMaps = {
  auth: {
    username: 'username' as const,
    email: 'email' as const,
    name: 'name' as const,
  },
  profile: {
    name: 'name' as const,
    email: 'email' as const,
    phone: 'phone' as const,
    address: 'address' as const,
  },
  user: {
    name: 'name' as const,
    username: 'username' as const,
    email: 'email' as const,
  },
  class: {
    name: 'text' as const,
    grade: 'grade' as const,
    section: 'section' as const,
  },
  assignment: {
    title: 'text' as const,
    description: 'description' as const,
    subject: 'text' as const,
  },
  message: {
    recipient: 'text' as const,
    message: 'description' as const,
  },
} as const;