import * as z from 'zod';
import { sanitizers } from './sanitization';

// Auth validations
export const loginSchema = z.object({
  username: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string()
    .transform(val => sanitizers.name(val))
    .pipe(z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters')),
  email: z.string()
    .transform(val => sanitizers.email(val))
    .pipe(z.string().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters')),
  username: z.string()
    .transform(val => sanitizers.username(val))
    .pipe(z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .transform(val => sanitizers.email(val))
    .pipe(z.string().email('Please enter a valid email address')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Assignment validations
export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  class: z.string().min(1, 'Class is required'),
  points: z.coerce.number().min(1).max(1000),
});

export const submitAssignmentSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  teacherId: z.string().optional(),
});

export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File must be less than 10MB')
    .refine(
      (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type),
      'Only PDF, DOC, DOCX, and TXT files are allowed'
    ),
});

export type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;
export type SubmitAssignmentFormData = z.infer<typeof submitAssignmentSchema>;

// Resource validations
export const resourceUploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  grade: z.string().min(1, 'Grade is required'),
  subject: z.string().min(1, 'Subject is required'),
  file: z.instanceof(File).refine((file) => file.size <= 50 * 1024 * 1024, 'File must be less than 50MB'),
});

export type ResourceUploadFormData = z.infer<typeof resourceUploadSchema>;

// Appeal validations
export const appealSubmissionSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type AppealSubmissionFormData = z.infer<typeof appealSubmissionSchema>;

// Behavior validations
export const behaviorRecordSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  type: z.enum(['positive', 'negative']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  points: z.coerce.number().min(1).max(100),
  date: z.string().optional(),
});

export type BehaviorRecordFormData = z.infer<typeof behaviorRecordSchema>;

// User management validations
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  role: z.enum(['student', 'teacher', 'parent', 'director', 'admin', 'super_admin']),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  role: z.enum(['student', 'teacher', 'parent', 'director', 'admin', 'super_admin']),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const avatarSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'Only JPEG, PNG, WebP, and GIF images are allowed'
    ),
});

// Class management validations
export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().min(1, 'Section is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1').max(200),
  academicYear: z.string().min(1, 'Academic year is required'),
  status: z.enum(['Active', 'Inactive']),
});

export type CreateClassFormData = z.infer<typeof createClassSchema>;

export const assignTeacherSchema = z.object({
  teacherId: z.string().min(1, 'Teacher is required'),
  subject: z.string().min(1, 'Subject is required').max(100),
});

export type AssignTeacherFormData = z.infer<typeof assignTeacherSchema>;

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(100),
  code: z.string().min(1, 'Subject code is required').max(20),
  description: z.string().optional(),
  credits: z.coerce.number().min(1).max(10).optional(),
});

export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>;
