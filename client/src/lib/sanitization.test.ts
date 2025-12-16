import { describe, it, expect } from 'vitest';
import { sanitizers, sanitizeFormData } from './sanitization';

describe('sanitizers.text', () => {
  it('removes HTML tags', () => {
    expect(sanitizers.text('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
  });

  it('removes javascript protocol', () => {
    expect(sanitizers.text('javascript:alert(1)')).toBe('alert(1)');
  });

  it('trims whitespace', () => {
    expect(sanitizers.text('  hello  ')).toBe('hello');
  });

  it('limits length to 1000 characters', () => {
    const long = 'a'.repeat(2000);
    expect(sanitizers.text(long)).toHaveLength(1000);
  });
});

describe('sanitizers.name', () => {
  it('allows letters and spaces', () => {
    expect(sanitizers.name('John Doe')).toBe('John Doe');
  });

  it('removes numbers', () => {
    expect(sanitizers.name('John123')).toBe('John');
  });

  it('normalizes multiple spaces', () => {
    expect(sanitizers.name('John   Doe')).toBe('John Doe');
  });

  it('limits length to 100 characters', () => {
    const long = 'a'.repeat(200);
    expect(sanitizers.name(long)).toHaveLength(100);
  });
});

describe('sanitizers.email', () => {
  it('converts to lowercase', () => {
    expect(sanitizers.email('TEST@EXAMPLE.COM')).toBe('test@example.com');
  });

  it('removes invalid characters', () => {
    expect(sanitizers.email('test<>@example.com')).toBe('test@example.com');
  });

  it('trims whitespace', () => {
    expect(sanitizers.email('  test@example.com  ')).toBe('test@example.com');
  });
});

describe('sanitizers.username', () => {
  it('converts to lowercase', () => {
    expect(sanitizers.username('TestUser')).toBe('testuser');
  });

  it('removes invalid characters', () => {
    expect(sanitizers.username('test@user!')).toBe('testuser');
  });

  it('allows dots, underscores, hyphens', () => {
    expect(sanitizers.username('test.user_name-123')).toBe('test.user_name-123');
  });
});

describe('sanitizers.phone', () => {
  it('removes non-phone characters', () => {
    expect(sanitizers.phone('+251-912-345-678')).toBe('+251912345678');
  });

  it('removes spaces', () => {
    expect(sanitizers.phone('+251 912 345 678')).toBe('+251912345678');
  });
});

describe('sanitizers.code', () => {
  it('converts to uppercase', () => {
    expect(sanitizers.code('math101')).toBe('MATH101');
  });

  it('removes special characters', () => {
    expect(sanitizers.code('MATH-101')).toBe('MATH101');
  });

  it('limits length to 20 characters', () => {
    expect(sanitizers.code('a'.repeat(30))).toHaveLength(20);
  });
});

describe('sanitizers.grade', () => {
  it('accepts valid grades 9-12', () => {
    expect(sanitizers.grade('9')).toBe('9');
    expect(sanitizers.grade('12')).toBe('12');
  });

  it('rejects invalid grades', () => {
    expect(sanitizers.grade('8')).toBe('');
    expect(sanitizers.grade('13')).toBe('');
  });

  it('removes non-numeric characters', () => {
    expect(sanitizers.grade('Grade 10')).toBe('10');
  });
});

describe('sanitizers.section', () => {
  it('converts to uppercase', () => {
    expect(sanitizers.section('a')).toBe('A');
  });

  it('takes only first letter', () => {
    expect(sanitizers.section('abc')).toBe('A');
  });

  it('removes numbers', () => {
    expect(sanitizers.section('a1')).toBe('A');
  });
});

describe('sanitizeFormData', () => {
  it('sanitizes specified fields', () => {
    const data = {
      username: 'TEST@USER',
      email: 'TEST@EXAMPLE.COM',
      other: 'unchanged',
    };

    const result = sanitizeFormData(data, {
      username: 'username',
      email: 'email',
    });

    expect(result.username).toBe('testuser');
    expect(result.email).toBe('test@example.com');
    expect(result.other).toBe('unchanged');
  });

  it('handles missing fields', () => {
    const data = { username: 'test' };
    const result = sanitizeFormData(data, { email: 'email' });
    expect(result).toEqual({ username: 'test' });
  });
});
