import { forwardRef } from 'react'

/** Labelled text input with error display. Works with react-hook-form refs. */
export const Input = forwardRef(function Input(
  { label, error, id, className = '', type = 'text', ...rest },
  ref
) {
  const inputId = id || rest.name
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-rose">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        type={type}
        aria-invalid={!!error}
        className={`input-base ${error ? 'border-rose-deep' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Input
