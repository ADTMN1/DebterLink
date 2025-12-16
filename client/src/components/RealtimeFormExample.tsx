import { useAuthForm } from '@/hooks';
import { SmartForm } from '@/components/ui/smart-form';

export function RealtimeLoginForm() {
  const { form, handleSubmit } = useAuthForm('login');

  const fields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text' as const,
      placeholder: 'Enter your username',
      sanitizer: 'username',
      showStrength: true,
      strengthType: 'username' as const,
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password' as const,
      placeholder: '••••••••',
      sanitizer: 'text',
      showStrength: true,
      strengthType: 'password' as const,
      required: true,
    },
  ];

  const onSubmit = handleSubmit(async (data) => {
    console.log('Login data:', data);
    // Handle login
  });

  return (
    <SmartForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Sign In"
      showProgress={true}
      className="max-w-md mx-auto"
    />
  );
}

export function RealtimeRegistrationForm() {
  const { form, handleSubmit } = useAuthForm('register');

  const fields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text' as const,
      placeholder: 'Enter your full name',
      sanitizer: 'name',
      required: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      placeholder: 'Enter your email',
      sanitizer: 'email',
      showStrength: true,
      strengthType: 'email' as const,
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text' as const,
      placeholder: 'Choose a username',
      sanitizer: 'username',
      showStrength: true,
      strengthType: 'username' as const,
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password' as const,
      placeholder: 'Create a password',
      sanitizer: 'text',
      showStrength: true,
      strengthType: 'password' as const,
      required: true,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      type: 'password' as const,
      placeholder: 'Confirm your password',
      sanitizer: 'text',
      required: true,
    },
  ];

  const onSubmit = handleSubmit(async (data) => {
    console.log('Registration data:', data);
    // Handle registration
  });

  return (
    <SmartForm
      form={form}
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Create Account"
      showProgress={true}
      className="max-w-md mx-auto"
    />
  );
}