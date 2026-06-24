import { forwardRef } from 'react'

/** Labelled textarea with error display. */
export const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 3, className = '', ...rest },
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
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        aria-invalid={!!error}
        className={`input-base resize-y ${error ? 'border-rose-deep' : ''} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Textarea
