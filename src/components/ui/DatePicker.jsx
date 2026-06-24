import { forwardRef } from 'react'

/**
 * DatePicker — a thin wrapper over the native date/time input so it inherits the
 * brand styling while staying fully accessible and keyboard-friendly.
 */
export const DatePicker = forwardRef(function DatePicker(
  { label, error, id, type = 'date', className = '', ...rest },
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
        className={`input-base [color-scheme:dark] ${error ? 'border-rose-deep' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default DatePicker
