import { z } from "zod";

export type UserRole = "super-admin" | "director" | "administrator" | "teacher" | "student" | "parent";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["super-admin", "director", "administrator", "teacher", "student", "parent"], {
    required_error: "Please select a role",
  }),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Base registration fields - kept as pure Zod object (no .refine())
const baseRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (e.g., +251911234567)"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 5 && age <= 120;
      },
      { message: "Please enter a valid date of birth" }
    ),
  address: z.string().optional(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

// Registration schema with all fields and conditional validation using superRefine
export const registerSchema = baseRegistrationSchema.extend({
  role: z.enum(["super-admin", "director", "administrator", "teacher", "student", "parent"]),
  schoolName: z.string().optional(),
  department: z.string().optional(),
  subject: z.string().optional(),
  employeeId: z.string().optional(),
  grade: z.string().optional(),
  section: z.string().optional(),
  studentId: z.string().optional(),
  parentName: z.string().optional(),
  relationship: z.string().optional(),
  childName: z.string().optional(),
  childStudentId: z.string().optional(),
}).superRefine((data, ctx) => {
  // Password match validation
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }

  // Admin/Director/Administrator validation
  if (data.role === "super-admin" || data.role === "director" || data.role === "administrator") {
    if (!data.schoolName || data.schoolName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "School name is required",
        path: ["schoolName"],
      });
    }
  }

  // Teacher validation
  if (data.role === "teacher") {
    if (!data.schoolName || data.schoolName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "School name is required",
        path: ["schoolName"],
      });
    }
    if (!data.department) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required",
        path: ["department"],
      });
    }
    if (!data.subject || data.subject.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Subject is required",
        path: ["subject"],
      });
    }
  }

  // Student validation
  if (data.role === "student") {
    if (!data.schoolName || data.schoolName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "School name is required",
        path: ["schoolName"],
      });
    }
    if (!data.studentId || data.studentId.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Student ID is required",
        path: ["studentId"],
      });
    }
    if (!data.grade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Grade is required",
        path: ["grade"],
      });
    }
  }

  // Parent validation
  if (data.role === "parent") {
    if (!data.childName || data.childName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Child's name is required",
        path: ["childName"],
      });
    }
    if (!data.childStudentId || data.childStudentId.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Child's Student ID is required",
        path: ["childStudentId"],
      });
    }
    if (!data.relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Relationship is required",
        path: ["relationship"],
      });
    }
  }
});

export type RegisterFormData = z.infer<typeof registerSchema>;