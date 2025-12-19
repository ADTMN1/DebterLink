import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSanitizedForm } from './use-sanitized-form';
import { useRealtimeValidation } from './use-realtime-validation';
import { toast } from 'sonner';
import * as schemas from '@/lib/validations';
import type { FieldValues } from 'react-hook-form';

// Generic form validation hook
export function useFormValidation<T extends FieldValues>(
  schemaName: keyof typeof schemas,
  defaultValues: T,
  sanitizationMap?: Record<keyof T, string>
) {
  const schema = schemas[schemaName];
  
  const form = useSanitizedForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    sanitizationMap,
  });

  const realtime = useRealtimeValidation(form);

  const handleSubmit = useCallback(
    (onSuccess: (data: T) => void | Promise<void>, onError?: (error: Error) => void) => {
      return form.handleSanitizedSubmit(async (data: T) => {
        try {
          await onSuccess(data);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          toast.error(errorMessage);
          onError?.(error as Error);
        }
      });
    },
    [form]
  );

  return { form, handleSubmit, realtime };
}

// Pre-configured hooks for common forms
export const useAuthForm = (type: 'login' | 'register' | 'forgotPassword') => {
  const configs = {
    login: {
      schema: 'loginSchema' as const,
      defaults: { username: '', password: '' },
      sanitization: {},
    },
    register: {
      schema: 'registerSchema' as const,
      defaults: { name: '', email: '', username: '', password: '', confirmPassword: '' },
      sanitization: { name: 'name', email: 'email', username: 'username' },
    },
    forgotPassword: {
      schema: 'forgotPasswordSchema' as const,
      defaults: { email: '' },
      sanitization: { email: 'email' },
    },
  };

  const config = configs[type];
  return useFormValidation(config.schema, config.defaults, config.sanitization);
};

export const useUserForm = (type: 'create' | 'edit') => {
  const configs = {
    create: {
      schema: 'createUserSchema' as const,
      defaults: { name: '', username: '', email: '', password: '', role: 'Student', status: 'Active' },
      sanitization: { name: 'name', username: 'username', email: 'email' },
    },
    edit: {
      schema: 'editUserSchema' as const,
      defaults: { name: '', email: '', role: 'Student', status: 'Active' },
      sanitization: { name: 'name', email: 'email' },
    },
  };

  const config = configs[type];
  return useFormValidation(config.schema, config.defaults, config.sanitization);
};

export const useProfileForm = () => {
  return useFormValidation(
    'profileSchema',
    { name: '', email: '', phone: '', address: '' },
    { name: 'name', email: 'email', phone: 'phone', address: 'address' }
  );
};

export const usePasswordForm = () => {
  return useFormValidation(
    'passwordChangeSchema',
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    { currentPassword: 'text', newPassword: 'text', confirmPassword: 'text' }
  );
};

export const useClassForm = () => {
  return useFormValidation(
    'createClassSchema',
    { name: '', grade: '', section: '', capacity: 40, academicYear: '', status: 'Active' },
    { name: 'text', grade: 'grade', section: 'section' }
  );
};

export const useSubjectForm = () => {
  return useFormValidation(
    'createSubjectSchema',
    { name: '', code: '', grade: '', creditHours: 1, description: '', status: 'Active' },
    { name: 'text', code: 'code', description: 'description' }
  );
};

export const useAssignmentForm = (type: 'create' | 'submit') => {
  const configs = {
    create: {
      schema: 'createAssignmentSchema' as const,
      defaults: { title: '', description: '', dueDate: '', class: '', points: 100 },
      sanitization: { title: 'text', description: 'description' },
    },
    submit: {
      schema: 'submitAssignmentSchema' as const,
      defaults: { subject: '', teacherId: '' },
      sanitization: { subject: 'text' },
    },
  };

  const config = configs[type];
  return useFormValidation(config.schema, config.defaults, config.sanitization);
};

export const useMessageForm = (type: 'send' | 'chat') => {
  const configs = {
    send: {
      schema: 'sendMessageSchema' as const,
      defaults: { recipient: '', message: '', recipientType: 'individual' },
      sanitization: { recipient: 'text', message: 'description' },
    },
    chat: {
      schema: 'chatMessageSchema' as const,
      defaults: { message: '' },
      sanitization: { message: 'description' },
    },
  };

  const config = configs[type];
  return useFormValidation(config.schema, config.defaults, config.sanitization);
};

export const useBehaviorForm = () => {
  return useFormValidation(
    'behaviorRecordSchema',
    { studentId: '', type: 'positive', category: '', description: '', severity: 'low', actionTaken: '' },
    { description: 'description', actionTaken: 'description' }
  );
};

export const useAppealForm = () => {
  return useFormValidation(
    'appealSubmissionSchema',
    { type: 'other', subject: '', description: '', evidence: '', requestedAction: '' },
    { subject: 'text', description: 'description', evidence: 'description', requestedAction: 'description' }
  );
};

export const useResourceForm = () => {
  return useFormValidation(
    'resourceUploadSchema',
    { title: '', description: '', category: '', grade: '', subject: '', file: null as any },
    { title: 'text', description: 'description', subject: 'text' }
  );
};

export const useGradeForm = () => {
  return useFormValidation(
    'gradeEntrySchema',
    { studentId: '', subject: '', assessmentType: 'quiz', score: 0, maxScore: 100, date: '', notes: '' },
    { subject: 'text', notes: 'description' }
  );
};