import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

/** Labelled textarea with error display. */
export const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 3, className = '', ...rest },
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
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn('input-base resize-y', error && 'border-rose-deep/60', className)}
        {...rest}
      />
      {error && <span className="text-xs text-rose-deep">{error}</span>}
    </div>
  )
})

export default Textarea
