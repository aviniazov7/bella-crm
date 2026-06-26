import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * Inviting empty-state: animated icon badge in a soft gradient circle,
 * title, description line, and an optional CTA action.
 * Backwards compatible with the old { message } prop.
 */
export function EmptyState({ title, description, message, icon, action }) {
  const heading = title || message || 'אין נתונים להצגה'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4 px-6 py-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/15 via-rose/10 to-transparent text-gold ring-1 ring-line"
      >
        {icon || <Sparkles className="h-7 w-7" />}
      </motion.div>
      <div className="space-y-1.5">
        <h3 className="font-serif text-lg font-semibold text-cream">{heading}</h3>
        {description && <p className="text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </motion.div>
  )
}

export default EmptyState
