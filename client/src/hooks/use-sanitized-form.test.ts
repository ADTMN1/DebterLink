import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSanitizedForm } from './use-sanitized-form';

describe('useSanitizedForm', () => {
  it('initializes form with default values', () => {
    const { result } = renderHook(() =>
      useSanitizedForm({
        defaultValues: { username: '', email: '' },
      })
    );

    expect(result.current.getValues()).toEqual({
      username: '',
      email: '',
    });
  });

  it('provides handleSanitizedSubmit function', () => {
    const { result } = renderHook(() =>
      useSanitizedForm({
        defaultValues: { username: '' },
      })
    );

    expect(typeof result.current.handleSanitizedSubmit).toBe('function');
  });

  it('updates form values', () => {
    const { result } = renderHook(() =>
      useSanitizedForm({
        defaultValues: { username: '' },
      })
    );

    act(() => {
      result.current.setValue('username', 'testuser');
    });

    expect(result.current.getValues('username')).toBe('testuser');
  });

  it('accepts sanitization map', () => {
    const { result } = renderHook(() =>
      useSanitizedForm({
        defaultValues: { username: '', email: '' },
        sanitizationMap: { username: 'username', email: 'email' },
      })
    );

    expect(result.current).toBeDefined();
  });
});
