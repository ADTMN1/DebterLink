import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { SanitizedInput } from './sanitized-input';
import { ValidationFeedback, FieldStrength } from './validation-feedback';
import { ValidationState } from '@/hooks/use-realtime-validation';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sanitizer?: string;
  validationState?: ValidationState;
  validationMessage?: string;
  showStrength?: boolean;
  strengthType?: 'password' | 'username' | 'email';
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    validationState = 'idle', 
    validationMessage, 
    showStrength = false,
    strengthType,
    value,
    sanitizer,
    ...props 
  }, ref) => {
    const getBorderColor = () => {
      switch (validationState) {
        case 'validating':
          return 'border-blue-300 focus:border-blue-500';
        case 'valid':
          return 'border-green-300 focus:border-green-500';
        case 'invalid':
          return 'border-red-300 focus:border-red-500';
        default:
          return 'border-input';
      }
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <SanitizedInput
            className={cn(
              'transition-colors duration-200',
              getBorderColor(),
              className
            )}
            ref={ref}
            value={value}
            sanitizer={sanitizer as any}
            {...props}
          />
          
          {/* Validation icon in input */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ValidationFeedback 
              state={validationState} 
              className="justify-end"
            />
          </div>
        </div>

        {/* Validation message */}
        {validationMessage && validationState === 'invalid' && (
          <ValidationFeedback 
            state={validationState}
            message={validationMessage}
          />
        )}

        {/* Field strength indicator */}
        {showStrength && strengthType && value && (
          <FieldStrength 
            value={String(value)}
            type={strengthType}
          />
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';