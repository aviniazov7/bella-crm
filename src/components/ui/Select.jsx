import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

/** Labelled select. options may be strings or { value, label } pairs. */
export const Select = forwardRef(function Select(
  { label, error, id, options = [], placeholder, className = '', ...rest },
  ref
) {
  const inputId = id || rest.name
  const normalized = options.map((o) =>
    typeof o === 'object' ? o : { value: o, label: o }
  )
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-cream/80">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            'input-base appearance-none pl-9',
            error && 'border-rose-deep/60',
            className
          )}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/40" />
      </div>
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Select
