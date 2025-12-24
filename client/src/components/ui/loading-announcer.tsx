cimport * as React from "react";

interface LoadingAnnouncerProps {
  isLoading: boolean;
  message?: string;
  children?: React.ReactNode;
}

export const LoadingAnnouncer: React.FC<LoadingAnnouncerProps> = ({ 
  isLoading, 
  message = "Loading...",
  children 
}) => {
  return (
    <div aria-busy={isLoading} aria-live="polite">
      {isLoading && (
        <span className="sr-only">{message}</span>
      )}
      {children}
    </div>
  );
};
