import * as React from "react";
import { Input } from "./input";
import { FormError } from "./form-error";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, id, className, ...props }, ref) => {
    const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={fieldId} className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ""}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        {error && (
          <FormError 
            id={`${fieldId}-error`}
            message={error}
          />
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
