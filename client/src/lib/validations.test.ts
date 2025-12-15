import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  createAssignmentSchema,
  fileUploadSchema,
  appealSubmissionSchema,
  behaviorRecordSchema,
  createUserSchema,
  passwordChangeSchema,
} from './validations';

describe('loginSchema', () => {
  it('validates correct login data', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short username', () => {
    const result = loginSchema.safeParse({
      username: 'ab',
      password: 'password123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 3 characters');
    }
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: '12345',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 6 characters');
    }
  });
});

describe('registerSchema', () => {
  it('validates correct registration data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'Password123',
      confirmPassword: 'Different123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });

  it('rejects weak password', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      password: 'password',
      confirmPassword: 'password',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
      username: 'johndoe',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('validates correct email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'test@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });
});

describe('createAssignmentSchema', () => {
  it('validates correct assignment data', () => {
    const result = createAssignmentSchema.safeParse({
      title: 'Math Homework',
      description: 'Complete exercises 1-10',
      dueDate: '2024-12-31',
      class: 'Grade 10A',
      points: 100,
    });
    expect(result.success).toBe(true);
  });

  it('rejects points over 1000', () => {
    const result = createAssignmentSchema.safeParse({
      title: 'Math Homework',
      description: 'Complete exercises',
      dueDate: '2024-12-31',
      class: 'Grade 10A',
      points: 1500,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = createAssignmentSchema.safeParse({
      title: '',
      description: '',
      dueDate: '',
      class: '',
      points: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('appealSubmissionSchema', () => {
  it('validates correct appeal data', () => {
    const result = appealSubmissionSchema.safeParse({
      subject: 'Grade Appeal',
      description: 'I believe my grade should be reviewed',
      category: 'academic',
      priority: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short description', () => {
    const result = appealSubmissionSchema.safeParse({
      subject: 'Appeal',
      description: 'Short',
      category: 'academic',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 10 characters');
    }
  });
});

describe('behaviorRecordSchema', () => {
  it('validates correct behavior record', () => {
    const result = behaviorRecordSchema.safeParse({
      studentId: 'student123',
      type: 'positive',
      category: 'participation',
      description: 'Excellent class participation',
      points: 10,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid type', () => {
    const result = behaviorRecordSchema.safeParse({
      studentId: 'student123',
      type: 'neutral',
      category: 'participation',
      description: 'Good participation',
      points: 10,
    });
    expect(result.success).toBe(false);
  });

  it('rejects points over 100', () => {
    const result = behaviorRecordSchema.safeParse({
      studentId: 'student123',
      type: 'positive',
      category: 'participation',
      description: 'Excellent participation',
      points: 150,
    });
    expect(result.success).toBe(false);
  });
});

describe('createUserSchema', () => {
  it('validates correct user data', () => {
    const result = createUserSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      role: 'teacher',
      password: 'SecurePass123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid role', () => {
    const result = createUserSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      role: 'invalid_role',
      password: 'SecurePass123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = createUserSchema.safeParse({
      name: 'Jane Smith',
      email: 'jane@example.com',
      username: 'janesmith',
      role: 'teacher',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });
});

describe('passwordChangeSchema', () => {
  it('validates matching passwords', () => {
    const result = passwordChangeSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
      confirmPassword: 'NewPass123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = passwordChangeSchema.safeParse({
      currentPassword: 'OldPass123',
      newPassword: 'NewPass123',
      confirmPassword: 'Different123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });
});
