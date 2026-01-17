import * as React from "react"
import { Label, Input } from "@/components/ui"
import { cn } from "@/lib/utils"

type FieldProps = {
  id: string
  label: string
  placeholder?: string
  helperText?: string
  error?: string

  containerClassName?: string
  inputClassName?: string
  errorClassName?: string
  labelClassName?: string

  /** Input constraints */
  maxLength?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void

  /** Optional character counter */
  showCount?: boolean

  disabled?: boolean

  required?: boolean
}

const disabledInputStyles =
  "disabled:bg-unifirst-gray-lightest " +
  "disabled:text-unifirst-gray-slate " +
  "disabled:border-unifirst-gray-light " +
  "disabled:hover:border-unifirst-gray-slate " +
  "disabled:cursor-not-allowed"

export function InputField({
   id,
   label,
   placeholder,
   helperText,
   error,
   containerClassName,
   inputClassName,
   errorClassName,
   labelClassName,
   maxLength,
   value,
   onChange,
   showCount = false,
   disabled = false,
   required = false
 }: FieldProps) {
  const hintId = helperText ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  const currentLength = value?.length ?? 0
  const isMaxed = maxLength !== undefined && currentLength >= maxLength

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={cn("text-sm font-medium", labelClassName)}
        >
          {label}
        </Label>

        {showCount && maxLength && (
          <span
            className={cn(
              "text-xs tabular-nums",
              isMaxed ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hintId}
        className={cn(
          "h-10",

          // UniFirst disabled tokens
          disabledInputStyles,

          // Error styling
          error && "border-destructive focus-visible:ring-destructive",

          // Max-length reached
          isMaxed && "border-destructive",

          // Allow override from the caller
          inputClassName
        )}
      />

      {helperText && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className={cn(
            "text-xs text-destructive font-medium",
            errorClassName
          )}
        >
          {error}
        </p>
      )}
    </div>
  )
}
