import { forwardRef } from 'react'

/**
 * Labelled select. `options` may be an array of strings or { value, label } pairs.
 */
export const Select = forwardRef(function Select(
  { label, error, id, options = [], placeholder, className = '', ...rest },
  ref
) {
  const inputId = id || rest.name
  const normalized = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }))
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-rose">
          {label}
        </label>
      )}
      <select
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        className={`input-base ${error ? 'border-rose-deep' : ''} ${className}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {normalized.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Select
