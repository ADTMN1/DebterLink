import * as React from "react";
import { cn } from "@/lib/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ message, className, ...props }, ref) => {
    if (!message) return null;

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {message}
      </div>
    );
  }
);
FormError.displayName = "FormError";
