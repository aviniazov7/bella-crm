import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/** Thin brand-styled wrapper over the native date/time input. */
export const DatePicker = forwardRef(function DatePicker(
  { label, error, id, type = 'date', className = '', ...rest },
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
        className={cn('input-base [color-scheme:dark]', error && 'border-rose-deep/60', className)}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default DatePicker
