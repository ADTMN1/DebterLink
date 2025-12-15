import React, { forwardRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { sanitizers } from '@/lib/sanitization';
import { cn } from '@/lib/utils';

interface SanitizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitizer?: keyof typeof sanitizers;
  onSanitizedChange?: (value: string) => void;
}

interface SanitizedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  sanitizer?: keyof typeof sanitizers;
  onSanitizedChange?: (value: string) => void;
}

export const SanitizedInput = forwardRef<HTMLInputElement, SanitizedInputProps>(
  ({ sanitizer = 'text', onSanitizedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizers[sanitizer](e.target.value);
      
      // Call the sanitized change handler
      onSanitizedChange?.(sanitized);
      
      // Call the original onChange
      onChange?.(e);
    };

    return (
      <Input
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

export const SanitizedTextarea = forwardRef<HTMLTextAreaElement, SanitizedTextareaProps>(
  ({ sanitizer = 'description', onSanitizedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const sanitized = sanitizers[sanitizer](e.target.value);
      
      // Update the textarea value with sanitized content
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
      }
      
      // Call the sanitized change handler
      onSanitizedChange?.(sanitized);
      
      // Call the original onChange with sanitized value
      if (onChange) {
        const sanitizedEvent = {
          ...e,
          target: { ...e.target, value: sanitized }
        };
        onChange(sanitizedEvent);
      }
    };

    return (
      <Textarea
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

SanitizedInput.displayName = 'SanitizedInput';
SanitizedTextarea.displayName = 'SanitizedTextarea';