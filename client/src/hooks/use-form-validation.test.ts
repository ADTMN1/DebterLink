import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuthForm, useUserForm, useProfileForm, usePasswordForm } from './use-form-validation';

describe('useAuthForm', () => {
  it('initializes login form with correct defaults', () => {
    const { result } = renderHook(() => useAuthForm('login'));
    expect(result.current.form.getValues()).toEqual({
      username: '',
      password: '',
    });
  });

  it('initializes register form with correct defaults', () => {
    const { result } = renderHook(() => useAuthForm('register'));
    expect(result.current.form.getValues()).toEqual({
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('initializes forgot password form with correct defaults', () => {
    const { result } = renderHook(() => useAuthForm('forgotPassword'));
    expect(result.current.form.getValues()).toEqual({
      email: '',
    });
  });
});

describe('useUserForm', () => {
  it('initializes create user form with correct defaults', () => {
    const { result } = renderHook(() => useUserForm('create'));
    const values = result.current.form.getValues();
    expect(values).toHaveProperty('name');
    expect(values).toHaveProperty('email');
    expect(values).toHaveProperty('username');
    expect(values).toHaveProperty('password');
  });

  it('initializes edit user form with correct defaults', () => {
    const { result } = renderHook(() => useUserForm('edit'));
    const values = result.current.form.getValues();
    expect(values).toHaveProperty('name');
    expect(values).toHaveProperty('email');
    expect(values).not.toHaveProperty('password');
  });
});

describe('useProfileForm', () => {
  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => useProfileForm());
    expect(result.current.form.getValues()).toEqual({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  });
});

describe('usePasswordForm', () => {
  it('initializes with correct defaults', () => {
    const { result } = renderHook(() => usePasswordForm());
    expect(result.current.form.getValues()).toEqual({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  });
});
