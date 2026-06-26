import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const VARIANTS = {
  primary: 'bg-gold-gradient text-gold-fg shadow-gold hover:shadow-soft-lg disabled:opacity-60',
  secondary:
    'bg-white/[0.04] text-cream border border-line hover:bg-white/[0.07] hover:border-ink-400',
  danger: 'bg-rose-deep text-ink hover:bg-rose disabled:opacity-60',
  ghost: 'bg-transparent text-cream/80 hover:bg-white/[0.05] hover:text-cream',
}

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

/** Reusable button with brand variants, ripple + motion. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  ...rest
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 600)
    onClick?.(e)
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={disabled || loading ? {} : { y: -2, scale: 1.015 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25"
          style={{ left: r.x, top: r.y, animation: 'ripple 0.6s ease-out forwards' }}
        />
      ))}
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
}

export default Button
