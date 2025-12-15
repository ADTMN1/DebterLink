/**
 * Multi-line text input component.
 * @module components/ui/textarea
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Accessible textarea with consistent styling and focus states.
 * @component
 * @example
 * <Textarea placeholder="Enter description" rows={4} />
 * <Textarea required aria-label="Comments" />
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
