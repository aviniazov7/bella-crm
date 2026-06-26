import { cn } from '../../lib/cn'

const VARIANTS = {
  gold: 'bg-gold/10 text-gold ring-gold/20',
  green: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  rose: 'bg-rose/10 text-rose ring-rose/25',
  gray: 'bg-white/5 text-cream/50 ring-white/10',
  red: 'bg-red-400/10 text-red-300 ring-red-400/20',
}

/** Small status pill. */
export function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        VARIANTS[variant] || VARIANTS.gold,
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
