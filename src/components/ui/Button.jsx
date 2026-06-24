/** Reusable button with brand variants. */
const VARIANTS = {
  primary: 'bg-gold text-ink hover:bg-gold-soft disabled:bg-gold-deep',
  secondary: 'bg-ink-200 text-rose-soft hover:bg-ink-300 border border-ink-300',
  danger: 'bg-rose-deep text-ink hover:bg-rose disabled:opacity-60',
  ghost: 'bg-transparent text-rose-soft hover:bg-ink-100',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  loading = false,
  disabled = false,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50
        disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

export default Button
