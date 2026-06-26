import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const SIZES = { sm: 'h-4 w-4', md: 'h-7 w-7', lg: 'h-10 w-10' }

/** Elegant gold spinner with optional label. */
export function Spinner({ size = 'md', label = 'טוען...', className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-10', className)}>
      <Loader2 className={cn('animate-spin text-gold', SIZES[size])} />
      {label && <span className="text-sm text-cream/50">{label}</span>}
    </div>
  )
}

/** Shimmer skeleton block for loading placeholders. */
export function Skeleton({ className = '' }) {
  return <div className={cn('skeleton', className)} />
}

export default Spinner
