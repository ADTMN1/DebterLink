import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  loadingMessage?: string;
  children: React.ReactNode;
}

export const LoadingContainer = React.forwardRef<HTMLDivElement, LoadingContainerProps>(
  ({ isLoading, loadingMessage = "Loading content...", children, className, ...props }, ref) => {
    React.useEffect(() => {
      if (isLoading) {
        const announcer = document.getElementById('polite-announcer');
        if (announcer) {
          announcer.textContent = loadingMessage;
          return () => {
            announcer.textContent = '';
          };
        }
      }
    }, [isLoading, loadingMessage]);

    return (
      <div
        ref={ref}
        aria-busy={isLoading}
        aria-live="polite"
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
LoadingContainer.displayName = "LoadingContainer";
