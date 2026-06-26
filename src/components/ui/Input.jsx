import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/** Labelled text input with error display. Works with react-hook-form refs. */
export const Input = forwardRef(function Input(
  { label, error, id, className = '', type = 'text', ...rest },
  ref
) {
  const inputId = id || rest.name
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-cream/80">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        type={type}
        className={cn('input-base', error && 'border-rose-deep/60 focus:ring-rose/20', className)}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Input
