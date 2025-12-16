import * as React from "react";

interface DataTableStatusProps {
  message: string;
  priority?: "polite" | "assertive";
  isLoading?: boolean;
}

export const DataTableStatus: React.FC<DataTableStatusProps> = ({ 
  message, 
  priority = "polite",
  isLoading = false
}) => {
  return (
    <div
      role={priority === "assertive" ? "alert" : "status"}
      aria-live={priority}
      aria-atomic="true"
      aria-busy={isLoading}
      className="sr-only"
    >
      {message}
    </div>
  );
};
