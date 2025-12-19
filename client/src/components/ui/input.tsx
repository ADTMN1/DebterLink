/**
 * Accessible input component with consistent styling.
 * @module components/ui/input
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Styled input field with focus states and accessibility support.
 * @component
 * @example
 * <Input type="text" placeholder="Enter name" />
 * <Input type="email" required aria-label="Email address" />
 * <Input type="password" disabled />
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm font-normal transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
