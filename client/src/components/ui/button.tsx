/**
 * Button component with multiple variants and sizes.
 * Supports loading states and can render as child component.
 * @module components/ui/button
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2 text-sm font-medium",
        sm: "h-9 rounded-md px-3 text-xs font-medium",
        lg: "h-12 rounded-md px-6 py-3 text-base font-medium",
        icon: "h-11 w-11 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component props
 * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 * @property {boolean} [asChild] - Render as child component using Radix Slot
 * @property {"default"|"destructive"|"outline"|"secondary"|"ghost"|"link"} [variant] - Visual style variant
 * @property {"default"|"sm"|"lg"|"icon"} [size] - Size variant
 * @example
 * <Button variant="default" size="lg">Click me</Button>
 * <Button variant="destructive" disabled>Delete</Button>
 * <Button variant="ghost" size="icon" aria-label="Menu"><Menu /></Button>
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Accessible button component with variants, sizes, and loading states.
 * Automatically handles aria-busy and aria-label for loading states.
 * @component
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isLoading = props['aria-busy'] === 'true' || props['aria-busy'] === true;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading ? 'true' : undefined}
        aria-live={isLoading ? 'polite' : undefined}
        aria-disabled={disabled ? 'true' : undefined}
        {...props}
      >
        {props.children}
        {isLoading && <span className="sr-only">Loading...</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
