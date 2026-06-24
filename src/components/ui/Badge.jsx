/** Small status pill. */
const VARIANTS = {
  gold: 'bg-gold/15 text-gold border border-gold/30',
  rose: 'bg-rose/15 text-rose border border-rose/30',
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  gray: 'bg-ink-300 text-rose-soft/70 border border-ink-300',
}

export function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${VARIANTS[variant] || VARIANTS.gold} ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
