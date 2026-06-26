import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/** Glassmorphism surface card with subtle hover elevation. */
export function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 28px 70px rgba(0,0,0,0.55)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'rounded-2xl border border-line bg-surface p-6 shadow-soft backdrop-blur-xl',
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Card title row with optional subtitle + action slot. */
export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-serif text-lg font-semibold text-cream">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export default Card
