import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const primaryStyles = "inline-flex items-center justify-center font-medium rounded-md " +
  "transition-colors duration-150 ease-in-out " +
  "focus:outline-none focus:ring-2 focus:ring-unifirst-green focus:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
  "bg-unifirst-green text-white hover:bg-unifirst-green-dark active:bg-unifirst-green-dark " +
  "px-4 py-2 text-sm"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium transition-colors duration-150 ease-in-out",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",

    // Focus (keyboard)
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-unifirst-green",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

    // ✅ Selected state — PLAIN BUTTONS
    "aria-pressed:ring-2 aria-pressed:ring-unifirst-green",
    "aria-pressed:ring-offset-2 aria-pressed:ring-offset-background",

    // ✅ Selected state — RADIX
    "data-[state=on]:ring-2 data-[state=on]:ring-unifirst-green",
    "data-[state=on]:ring-offset-2 data-[state=on]:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        default: primaryStyles,
        primary: primaryStyles,
        secondary:
          "inline-flex items-center justify-center font-medium rounded-md " +
          "transition-colors duration-150 ease-in-out " +
          "focus:outline-none focus:ring-2 focus:ring-unifirst-green focus:ring-offset-2 " +
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
          "bg-unifirst-gray-light text-unifirst-gray-dark hover:bg-unifirst-gray-warm active:bg-unifirst-gray-slate " +
          "px-4 py-2 text-sm",
        destructive:
          "inline-flex items-center justify-center font-medium rounded-md " +
          "transition-colors duration-150 ease-in-out " +
          "focus:outline-none focus:ring-2 focus:ring-unifirst-green focus:ring-offset-2 " +
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 " +
          "px-4 py-2 text-sm",
        outline:
          "inline-flex items-center justify-center font-medium rounded-md " +
          "transition-colors duration-150 ease-in-out " +
          "focus:outline-none focus:ring-2 focus:ring-unifirst-green focus:ring-offset-2 " +
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
          "border-2 border-unifirst-green text-unifirst-green hover:bg-unifirst-green-lightest active:bg-unifirst-green-lighter " +
          "px-4 py-2 text-sm",
        ghost:
          "inline-flex items-center justify-center font-medium rounded-md " +
          "transition-colors duration-150 ease-in-out " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-unifirst-green focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none " +
          "text-unifirst-gray-dark hover:bg-unifirst-gray-lightest active:bg-unifirst-gray-light " +
          "px-4 py-2 text-sm",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Standard shadcn sizes (used by other components)
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        // Custom UniFirst sizes
        md: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
