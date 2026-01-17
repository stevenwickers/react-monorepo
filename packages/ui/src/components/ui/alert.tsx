import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "flex gap-3 p-4 rounded-lg border",
  {
    variants: {
      variant: {
        default: "bg-unifirst-gray-lightest border-unifirst-gray-light text-unifirst-gray-dark",
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-unifirst-green-lightest border-unifirst-green-light text-unifirst-green-dark",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        error: "bg-red-50 border-red-200 text-red-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  destructive: XCircle,
}

const iconColorMap = {
  default: "text-unifirst-gray-slate",
  info: "text-blue-500",
  success: "text-unifirst-green",
  warning: "text-amber-500",
  error: "text-red-500",
  destructive: "text-red-500",
}

function Alert({
  className,
  variant = "default",
  title,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & { title?: string }) {
  const Icon = iconMap[variant || "default"]
  const iconColor = iconColorMap[variant || "default"]

  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0", iconColor)} />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "mb-1 font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
