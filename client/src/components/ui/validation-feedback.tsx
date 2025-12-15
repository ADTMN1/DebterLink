import { cn } from '@/lib/utils';
import { Check, X, Loader2, AlertCircle } from 'lucide-react';
import { ValidationState } from '@/hooks/use-realtime-validation';

interface ValidationFeedbackProps {
  state: ValidationState;
  message?: string;
  className?: string;
}

export function ValidationFeedback({ state, message, className }: ValidationFeedbackProps) {
  const getIcon = () => {
    switch (state) {
      case 'validating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'valid':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'validating':
        return 'text-blue-600';
      case 'valid':
        return 'text-green-600';
      case 'invalid':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  if (state === 'idle') return null;

  return (
    <div className={cn('flex items-center gap-2 text-sm', getTextColor(), className)}>
      {getIcon()}
      {message && <span>{message}</span>}
    </div>
  );
}

interface FormProgressProps {
  progress: number;
  className?: string;
}

export function FormProgress({ progress, className }: FormProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Form completion</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface FieldStrengthProps {
  value: string;
  type: 'password' | 'username' | 'email';
  className?: string;
}

export function FieldStrength({ value, type, className }: FieldStrengthProps) {
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = [
      { test: /.{8,}/, label: '8+ characters' },
      { test: /[a-z]/, label: 'lowercase' },
      { test: /[A-Z]/, label: 'uppercase' },
      { test: /[0-9]/, label: 'number' },
      { test: /[^A-Za-z0-9]/, label: 'special char' },
    ];

    const passed = checks.filter(check => check.test.test(password));
    score = (passed.length / checks.length) * 100;

    return {
      score,
      checks: checks.map(check => ({
        ...check,
        passed: check.test.test(password),
      })),
    };
  };

  const getUsernameStrength = (username: string) => {
    let score = 0;
    const checks = [
      { test: /.{3,}/, label: '3+ characters' },
      { test: /^[a-z0-9._-]+$/, label: 'valid format' },
      { test: /^[a-z]/, label: 'starts with letter' },
    ];

    const passed = checks.filter(check => check.test.test(username));
    score = (passed.length / checks.length) * 100;

    return {
      score,
      checks: checks.map(check => ({
        ...check,
        passed: check.test.test(username),
      })),
    };
  };

  const getEmailStrength = (email: string) => {
    let score = 0;
    const checks = [
      { test: /@/, label: 'contains @' },
      { test: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'valid format' },
      { test: /\.[a-z]{2,}$/i, label: 'valid domain' },
    ];

    const passed = checks.filter(check => check.test.test(email));
    score = (passed.length / checks.length) * 100;

    return {
      score,
      checks: checks.map(check => ({
        ...check,
        passed: check.test.test(email),
      })),
    };
  };

  if (!value) return null;

  const getStrength = () => {
    switch (type) {
      case 'password':
        return getPasswordStrength(value);
      case 'username':
        return getUsernameStrength(value);
      case 'email':
        return getEmailStrength(value);
      default:
        return { score: 0, checks: [] };
    }
  };

  const { score, checks } = getStrength();

  const getColor = () => {
    if (score < 40) return 'bg-red-500';
    if (score < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="w-full bg-muted rounded-full h-1">
        <div 
          className={cn('h-1 rounded-full transition-all duration-300', getColor())}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-1">
            {check.passed ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={check.passed ? 'text-green-600' : 'text-muted-foreground'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}